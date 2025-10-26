import { Card, CardContent, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface ActionCardProps {
    title: string;
    children: ReactNode;
}

export default function ActionCard({ title, children }: ActionCardProps) {
    return (
        <Card sx={{ flex: "1 1 300px", minWidth: "300px", display: "flex", flexDirection: "column", boxShadow: 3 }}>
            <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                <Typography variant="h6" gutterBottom color="primary">{title}</Typography>
                {children}
            </CardContent>
        </Card>
    );
}
