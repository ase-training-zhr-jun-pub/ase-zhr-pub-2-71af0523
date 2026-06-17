import { Link, type LinkProps } from "react-router-dom"
import { type VariantProps } from "class-variance-authority"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type LinkButtonProps = LinkProps & VariantProps<typeof buttonVariants>

/**
 * Ein <Link>, der wie ein Button aussieht. Vermeidet die base-ui-Warnung,
 * die entsteht, wenn man <Button render={<Link/>}> mit nativeButton nutzt.
 */
export function LinkButton({ className, variant, size, ...props }: LinkButtonProps) {
  return <Link className={cn(buttonVariants({ variant, size, className }))} {...props} />
}
