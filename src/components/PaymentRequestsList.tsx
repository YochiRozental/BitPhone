import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Stack,
  Alert,
} from "@mui/material";
import * as api from "../api/apiService";
import type { User } from "../types";

interface PaymentRequestsListProps {
  user: User;
}

export default function PaymentRequestsList({ user }: PaymentRequestsListProps) {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const loadRequests = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      const data = await api.getPaymentRequests(user);
      setRequests(data);
      if (data.length === 0) {
        setMessage({ text: "אין בקשות תשלום חדשות.", type: "success" });
      }
    } catch (error: any) {
      setMessage({ text: error.message || "שגיאה בטעינת הבקשות.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRespond = async (reqId: string, approve: boolean) => {
    try {
      await api.respondToPaymentRequest(user, reqId, approve);
      setMessage({
        text: approve ? "הבקשה אושרה בהצלחה ✅" : "הבקשה סורבה ❌",
        type: "success",
      });
      setRequests((prev) => prev.filter((r) => r.id !== reqId));
    } catch (error: any) {
      setMessage({ text: error.message || "שגיאה בטיפול בבקשה.", type: "error" });
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        בקשות תשלום שהתקבלו
      </Typography>

      {message && <Alert severity={message.type}>{message.text}</Alert>}

      {isLoading && (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress />
        </Box>
      )}

      {!isLoading && requests.length > 0 && (
        <Stack spacing={2} mt={2}>
          {requests.map((req) => (
            <Card key={req.id}>
              <CardContent>
                <Typography variant="body1">
                  <strong>מ:</strong> {req.from_user || req.related_phone}
                </Typography>
                <Typography variant="body2">
                  <strong>סכום:</strong> {req.amount} ₪
                </Typography>

                <Stack direction="row" spacing={2} mt={2}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleRespond(req.id, true)}
                  >
                    אשר
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleRespond(req.id, false)}
                  >
                    סרב
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
}
