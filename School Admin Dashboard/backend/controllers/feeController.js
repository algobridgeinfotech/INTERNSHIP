import PDFDocument from "pdfkit";
import Fee from "../models/Fee.js";
import Student from "../models/Student.js";

const resolveStatus = (amount, paidAmount) => {
  if (paidAmount >= amount) return "Paid";
  if (paidAmount > 0) return "Partial";
  return "Unpaid";
};

const syncStudentFeeStatus = async (studentId) => {
  const fees = await Fee.find({ student: studentId });
  const status = fees.length && fees.every((fee) => fee.status === "Paid") ? "Paid" : fees.some((fee) => fee.status === "Partial") ? "Partial" : "Unpaid";
  await Student.findByIdAndUpdate(studentId, { feeStatus: status });
};

export const createFee = async (req, res) => {
  const { studentId, title, amount, paidAmount = 0, dueDate, paidDate, paymentMethod } = req.body;
  const student = await Student.findById(studentId);
  if (!student) return res.status(404).json({ message: "Student not found" });

  const status = resolveStatus(Number(amount), Number(paidAmount));
  const fee = await Fee.create({
    student: studentId,
    title,
    amount,
    paidAmount,
    dueDate,
    paidDate: status === "Paid" ? paidDate || new Date() : paidDate,
    paymentMethod,
    status,
    receiptNumber: status === "Paid" ? `R-${Date.now()}` : undefined
  });

  await syncStudentFeeStatus(studentId);
  res.status(201).json(fee);
};

export const updateFee = async (req, res) => {
  const fee = await Fee.findById(req.params.id);
  if (!fee) return res.status(404).json({ message: "Fee not found" });

  Object.assign(fee, req.body);
  fee.status = resolveStatus(Number(fee.amount), Number(fee.paidAmount));
  if (fee.status === "Paid" && !fee.receiptNumber) {
    fee.receiptNumber = `R-${Date.now()}`;
    fee.paidDate = fee.paidDate || new Date();
  }
  await fee.save();
  await syncStudentFeeStatus(fee.student);

  res.json(fee);
};

export const getFees = async (req, res) => {
  const query = {};
  if (req.query.status) query.status = req.query.status;
  if (req.query.studentId) query.student = req.query.studentId;

  const fees = await Fee.find(query).populate("student", "name rollNumber className section").sort({ dueDate: -1 });
  res.json(fees);
};

export const downloadReceipt = async (req, res) => {
  const fee = await Fee.findById(req.params.id).populate("student", "name rollNumber className section");
  if (!fee) return res.status(404).json({ message: "Fee not found" });

  const doc = new PDFDocument({ margin: 40 });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=receipt-${fee.receiptNumber || fee._id}.pdf`);
  doc.pipe(res);

  doc.fontSize(20).text("Fee Receipt", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Receipt No: ${fee.receiptNumber || "Pending"}`);
  doc.text(`Student: ${fee.student.name}`);
  doc.text(`Roll Number: ${fee.student.rollNumber}`);
  doc.text(`Class: ${fee.student.className} - ${fee.student.section}`);
  doc.text(`Fee: ${fee.title}`);
  doc.text(`Amount: ${fee.amount}`);
  doc.text(`Paid: ${fee.paidAmount}`);
  doc.text(`Status: ${fee.status}`);
  doc.text(`Date: ${new Date().toLocaleDateString()}`);
  doc.end();
};
