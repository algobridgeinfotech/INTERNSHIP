import "./globals.css";

export const metadata = {
  title: "Student Admin Dashboard",
  description: "Student management admin dashboard"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
