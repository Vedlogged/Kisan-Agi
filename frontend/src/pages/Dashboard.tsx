import { motion } from 'framer-motion';
import { Mic, Activity, Leaf, TrendingUp, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/DashboardLayout';
import FileUploadBtn from '@/components/FileUploadBtn';
import { useScanStore } from '@/store/scanStore';
import { toast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { scanHistory } = useScanStore();

  const handleVoiceCommand = () => {
    toast({
      title: "Voice Assistant",
      description: "Voice commands coming soon...",
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="font-orbitron text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Crop Health Scanner
          </h1>
          <p className="text-muted-foreground">
            Upload a leaf image to detect diseases and get treatment recommendations
          </p>
        </motion.div>

        {/* Health Status Gauge */}
        <motion.div
          className="glass-card-glow p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-orbitron text-lg font-semibold text-foreground flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Crop Health Status
            </h2>
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-500 text-sm font-medium">
              Awaiting Scan
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Scans Today', value: scanHistory.length.toString(), icon: Leaf, color: 'text-primary' },
              { label: 'Health Score', value: '--', icon: TrendingUp, color: 'text-muted-foreground' },
              { label: 'Alerts', value: '0', icon: AlertCircle, color: 'text-amber-500' },
            ].map((stat, index) => (
              <div key={index} className="text-center p-4 rounded-xl bg-card/50">
                <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                <div className="font-orbitron text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upload Zone */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <FileUploadBtn />
        </motion.div>

        {/* Action Buttons - Removed as scanning is automatic now */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <p className="text-sm text-muted-foreground italic">
            * Analysis starts automatically upon image upload
          </p>
        </motion.div>

        {/* Quick Tips */}
        <motion.div
          className="mt-8 glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <h3 className="font-orbitron text-sm font-semibold text-foreground mb-4">
            Tips for Best Results
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              Capture clear, well-lit images of affected leaves
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              Include both healthy and diseased parts if visible
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              Avoid blurry or dark images for accurate diagnosis
            </li>
          </ul>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
