import React from "react";
import Alert from "@material-tailwind/react/Alert";

export default function AlertMessage(color, message) {
    return (
        <Alert color={color}>{message}</Alert>
    );
}