const fs = require('fs');
const path = require('path');

const modules = [
  'schools', 'admins', 'subscriptions', 'security', 'cms', 'database',
  'examination', 'fees', 'payroll', 'admissions', 'timetable', 'transport', 'notifications',
  'homework', 'assignments', 'reports', 'online-classes',
  'results', 'materials',
  'child',
  'inventory', 'expenses', 'visitors', 'library'
];

const basePath = path.join(__dirname, 'frontend', 'src', 'app', 'dashboard');

const template = (title) => `import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard } from "lucide-react";

export default function ${title.replace(/[^a-zA-Z]/g, '')}Page() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">${title.replace(/-/g, ' ')}</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Active</CardTitle>
            <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">120</div>
            <p className="text-xs text-muted-foreground">+4% from last month</p>
          </CardContent>
        </Card>
      </div>
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="h-[400px] flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg text-slate-500 font-medium">
          ${title.replace(/-/g, ' ')} Module Interface
        </div>
      </div>
    </div>
  );
}
`;

modules.forEach(mod => {
  const modPath = path.join(basePath, mod);
  if (!fs.existsSync(modPath)) {
    fs.mkdirSync(modPath, { recursive: true });
  }
  const pagePath = path.join(modPath, 'page.tsx');
  if (!fs.existsSync(pagePath)) {
    fs.writeFileSync(pagePath, template(mod.charAt(0).toUpperCase() + mod.slice(1)));
  }
});

console.log('Modules scaffolded successfully.');
