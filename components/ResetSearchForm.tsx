"use client";
import { X } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const ResetSearchForm = () => {
  const reset = () => {
    const form = document.querySelector(
      ".search-form-container",
    ) as HTMLFormElement;
    if (form) form.reset();
  };

  return (
    <Button className="search-form-reset" type="reset" onClick={reset}>
      <Link href="/">
        <X className="search-form-icon-small text-slate-400" />
      </Link>
    </Button>
  );
};

export default ResetSearchForm;
