import { useId } from "react";
import { Image } from "@heroui/image";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function Moyendepaiementagence() {
  const id = useId();
  return (
    <ul className="space-y-4">
      <li>
        <div className="bg-glacev2 border-input has-data-[state=checked]:border-primary/50 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none">
          <Checkbox
            id="mtn"
            className="order-1 after:absolute after:inset-0"
            aria-describedby={`mtn-description`}
          />
          <div className="flex grow items-start gap-3">
            <Image
              alt="Logo MTN Mobile Money"
              src="https://res.cloudinary.com/dtrpkegss/image/upload/v1758916411/28-280910_595-x-842-25-logo-de-mtn-money_kxalnw.jpg"
              width={75}
              height={50}
              className="object-cover"
              radius="full"
            />
            <div className="grid gap-2">
              <Label htmlFor="mtn">
                MTN
                <span className="text-muted-foreground text-xs leading-[inherit] font-normal">
                  (Mobile Money)
                </span>
              </Label>
              <p
                id={`mtn-description`}
                className="text-muted-foreground text-xs"
              >
                Activez le paiement par Mobile Money pour capter la large
                clientèle MTN. Vos clients paient directement depuis leur wallet
                mobile.
              </p>
            </div>
          </div>
        </div>
      </li>
      <li>
        <div className="bg-glacev2 border-input has-data-[state=checked]:border-primary/50 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none">
          <Checkbox
            id="airtel"
            className="order-1 after:absolute after:inset-0"
            aria-describedby={`airtel-description`}
          />
          <div className="flex grow items-start gap-3">
            <Image
              alt="Logo Airtel Money"
              src="https://res.cloudinary.com/dtrpkegss/image/upload/v1758916405/airtel-2010-vector-logo-11574259322t5jrebpk6e_mvxlfb.png"
              width={75}
              height={50}
              className="object-cover"
              radius="full"
            />
            <div className="grid gap-2">
              <Label htmlFor="airtel">
                Label{" "}
                <span className="text-muted-foreground text-xs leading-[inherit] font-normal">
                  (Sublabel)
                </span>
              </Label>
              <p
                id={`airtel-description`}
                className="text-muted-foreground text-xs"
              >
                Proposez le paiement par Airtel Money pour toucher des millions
                d&#39;utilisateurs. Transactions instantanées et sécurisées
                depuis l&#39;application Airtel.
              </p>
            </div>
          </div>
        </div>
      </li>
    </ul>
  );
}
