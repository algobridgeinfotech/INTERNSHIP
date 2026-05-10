import { Settings as SettingsIcon, Building2, Bell, Shield, Paintbrush } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your school profile, branding, and system preferences.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-64 flex-shrink-0">
          <nav className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-1 overflow-x-auto pb-2 md:pb-0">
            <button className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium bg-primary/10 text-primary w-full text-left">
              <Building2 className="h-4 w-4 mr-3" /> School Profile
            </button>
            <button className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground w-full text-left transition-colors">
              <Paintbrush className="h-4 w-4 mr-3" /> Branding
            </button>
            <button className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground w-full text-left transition-colors">
              <Shield className="h-4 w-4 mr-3" /> Roles & Permissions
            </button>
            <button className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground w-full text-left transition-colors">
              <Bell className="h-4 w-4 mr-3" /> Notifications
            </button>
          </nav>
        </aside>

        <div className="flex-1 bg-card border border-border rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-6">School Information</h3>
          
          <div className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">School Name</label>
                <input type="text" defaultValue="Campus OS Demo School" className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Registration Number</label>
                <input type="text" defaultValue="REG-2023-001" className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Address</label>
              <textarea rows={3} defaultValue="123 Education Lane, Silicon Valley, CA 94000" className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>

            <div className="pt-4 flex justify-end">
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm hover:bg-primary/90 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
