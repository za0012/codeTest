import { AnimatePresence, motion } from "framer-motion";
import { AlertCircleIcon, CheckCircle2Icon, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export interface alertType {
  title: string;
  content: string;
  variant: boolean;
  customClick?: () => void;
}

interface alertProps {
  alert: alertType | null;
  onClose: () => void;
}

export function AlertCustom({ alert, onClose }: alertProps) {
  const hadleClick = () => {
    if (!alert) return;
    if (!alert.customClick) {
      onClose();
    } else {
      alert.customClick();
    }
  };

  return (
    <AnimatePresence>
      {alert && (
        <div className="fixed inset-0 bg-black/30 z-50 flex justify-center items-start pt-10">
          <motion.div
            initial={{ opacity: 0, y: -50 }} // 시작 위치 (위로 50px, 투명)
            animate={{ opacity: 1, y: 0 }} // 나타날 때 위치 (제자리)
            exit={{ opacity: 0, y: -50 }} // 사라질 때 위치 (다시 위로)
            transition={{ duration: 0.3, ease: "easeOut" }} // 부드러움 조절
            className="w-full max-w-md px-4"
          >
            <div className="grid gap-4">
              <Alert variant={`${alert.variant ? "destructive" : "default"}`}>
                {alert.variant ? (
                  <AlertCircleIcon className="h-4 w-4" />
                ) : (
                  <CheckCircle2Icon className="h-4 w-4" />
                )}

                <AlertTitle>{alert.title}</AlertTitle>
                <button
                  type="button"
                  onClick={hadleClick}
                  className="shrink-0 self-center"
                >
                  <X className="h-4 w-4" />
                </button>
                <AlertDescription>{alert.content}</AlertDescription>
              </Alert>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
