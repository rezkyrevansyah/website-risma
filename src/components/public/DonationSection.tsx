"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Copy, Check, Building2 } from "lucide-react";
import { toast } from "sonner";

import { DonationInfo } from "@/types";
import { defaultDonation } from "@/data";

interface DonationSectionProps {
  donation?: DonationInfo;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function DonationSection({
  donation = defaultDonation,
}: DonationSectionProps) {
  const [copied, setCopied] = useState(false);

  const progress = (donation.currentAmount / donation.goalAmount) * 100;

  const copyAccountNumber = async () => {
    try {
      await navigator.clipboard.writeText(donation.accountNumber);
      setCopied(true);
      toast.success("Nomor rekening berhasil disalin!", {
        description: donation.accountNumber,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Gagal menyalin nomor rekening");
    }
  };

  return (
    <section id="donasi" className="section-padding">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950 dark:to-slate-900 pattern-islamic">
            <CardContent className="p-8 md:p-12">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-emerald mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Mari Berdonasi
                </h2>
                <p
                  className="font-arabic text-xl md:text-2xl text-muted-foreground mb-4"
                  style={{ fontFamily: "serif" }}
                >
                  مَنْ ذَا الَّذِي يُقْرِضُ اللَّهَ قَرْضًا حَسَنًا
                </p>
                <p className="text-muted-foreground italic">
                  &ldquo;Siapakah yang mau meminjamkan kepada Allah pinjaman yang
                  baik...&rdquo;
                  <span className="block text-sm mt-1">
                    — QS. Al-Hadid: 11
                  </span>
                </p>
              </div>

              {/* Bank Account Card */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-emerald flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{donation.bankName}</p>
                    <p className="text-muted-foreground text-sm">
                      a.n. {donation.holderName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-700 rounded-xl p-4">
                  <p className="font-mono text-xl md:text-2xl font-bold tracking-wider">
                    {donation.accountNumber}
                  </p>
                  <Button
                    onClick={copyAccountNumber}
                    variant="outline"
                    size="sm"
                    className={`gap-2 transition-all hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 ${
                      copied
                        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                        : ""
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Tersalin
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Salin
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Dana Terkumpul</span>
                  <span className="font-semibold">
                    {Math.round(progress)}% dari target
                  </span>
                </div>

                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-emerald rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
                  <div className="text-center sm:text-left">
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(donation.currentAmount)}
                    </p>
                    <p className="text-sm text-muted-foreground">Terkumpul</p>
                  </div>
                  <div className="text-center sm:text-right">
                    <p className="text-2xl font-bold">
                      {formatCurrency(donation.goalAmount)}
                    </p>
                    <p className="text-sm text-muted-foreground">Target</p>
                  </div>
                </div>
              </div>

              {/* Note */}
              <p className="text-center text-sm text-muted-foreground mt-8">
                Semoga Allah SWT melipatgandakan kebaikan Anda. <br />
                Konfirmasi donasi via WhatsApp untuk pencatatan.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
