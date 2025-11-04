import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Settings() {
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="flex gap-2">
              <Input id="email" type="email" defaultValue="user@example.com" />
              <Button variant="outline">Edit</Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="flex gap-2">
              <Input id="password" type="password" defaultValue="••••••••" />
              <Button variant="outline">Change</Button>
            </div>
          </div>
          <div className="pt-4">
            <Button variant="destructive">Delete Account</Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Preferences</h2>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="currency">Default Currency</Label>
            <Select defaultValue="usd">
              <SelectTrigger id="currency" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="usd">USD - US Dollar</SelectItem>
                <SelectItem value="eur">EUR - Euro</SelectItem>
                <SelectItem value="gbp">GBP - British Pound</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select defaultValue="en">
              <SelectTrigger id="language" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="pl">Polish</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="font-medium">Notification Preferences</h3>
            {[
              { id: "budget", label: "Budget Alerts", defaultChecked: true },
              { id: "weekly", label: "Weekly Summary", defaultChecked: true },
              { id: "goals", label: "Goal Milestones", defaultChecked: true },
              { id: "marketing", label: "Marketing Emails", defaultChecked: false },
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <Label htmlFor={item.id} className="cursor-pointer">
                  {item.label}
                </Label>
                <Switch id={item.id} defaultChecked={item.defaultChecked} />
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Data & Privacy</h2>
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Export My Data</Label>
            <div className="flex gap-2">
              <Button variant="outline">Export as CSV</Button>
              <Button variant="outline">Export as PDF</Button>
            </div>
          </div>
          <div className="space-y-2">
            <a href="#" className="text-primary hover:underline block">Privacy Policy</a>
            <a href="#" className="text-primary hover:underline block">Terms of Service</a>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Security</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
            </div>
            <Button variant="outline">Enable</Button>
          </div>
          <div className="pt-4 border-t border-border">
            <h3 className="font-medium mb-4">Active Sessions</h3>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium">Firefox on Windows</p>
                <p className="text-sm text-muted-foreground">Last active 2 hours ago</p>
              </div>
              <Button variant="outline" size="sm">Logout</Button>
            </div>
          </div>
          <Button variant="outline" className="w-full">View Login History</Button>
        </div>
      </Card>
    </div>
  );
}
