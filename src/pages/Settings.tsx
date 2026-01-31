import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useSettingsStore } from '@/stores/settings-store'
import { 
  Sun, 
  Moon, 
  Monitor, 
  Timer, 
  Bell, 
  Eye,
  EyeOff,
  Info
} from 'lucide-react'

export default function Settings() {
  const {
    theme,
    scanInterval,
    showNotifications,
    showVendor,
    showBssid,
    signalUnit,
    setTheme,
    setScanInterval,
    setShowNotifications,
    setShowVendor,
    setShowBssid,
    setSignalUnit,
  } = useSettingsStore()

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure your Open Network experience
        </p>
      </div>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how Open Network looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="font-medium">Theme</label>
              <p className="text-sm text-muted-foreground">
                Choose your preferred color scheme
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('light')}
              >
                <Sun className="h-4 w-4 mr-1" />
                Light
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('dark')}
              >
                <Moon className="h-4 w-4 mr-1" />
                Dark
              </Button>
              <Button
                variant={theme === 'system' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('system')}
              >
                <Monitor className="h-4 w-4 mr-1" />
                System
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scanning */}
      <Card>
        <CardHeader>
          <CardTitle>Scanning</CardTitle>
          <CardDescription>Configure WiFi scanning behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="font-medium flex items-center gap-2">
                <Timer className="h-4 w-4" />
                Auto-refresh Interval
              </label>
              <p className="text-sm text-muted-foreground">
                How often to scan for networks
              </p>
            </div>
            <div className="flex gap-2">
              {[3, 5, 10, 30].map(seconds => (
                <Button
                  key={seconds}
                  variant={scanInterval === seconds ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setScanInterval(seconds)}
                >
                  {seconds}s
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Display */}
      <Card>
        <CardHeader>
          <CardTitle>Display Options</CardTitle>
          <CardDescription>Customize what information is shown</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="font-medium">Show Vendor</label>
              <p className="text-sm text-muted-foreground">
                Display manufacturer name from MAC address
              </p>
            </div>
            <Switch
              checked={showVendor}
              onCheckedChange={setShowVendor}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="font-medium">Show BSSID</label>
              <p className="text-sm text-muted-foreground">
                Display MAC address of access points
              </p>
            </div>
            <Switch
              checked={showBssid}
              onCheckedChange={setShowBssid}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="font-medium">Signal Unit</label>
              <p className="text-sm text-muted-foreground">
                Display signal as dBm or percentage
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={signalUnit === 'dbm' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSignalUnit('dbm')}
              >
                dBm
              </Button>
              <Button
                variant={signalUnit === 'percent' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSignalUnit('percent')}
              >
                %
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Configure alerts and notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="font-medium flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Security Alerts
              </label>
              <p className="text-sm text-muted-foreground">
                Get notified about insecure networks
              </p>
            </div>
            <Switch
              checked={showNotifications}
              onCheckedChange={setShowNotifications}
            />
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Version</span>
            <Badge variant="outline">1.0.0</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">License</span>
            <Badge variant="outline">MIT</Badge>
          </div>
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Open Network is an open-source project. Contributions are welcome!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
