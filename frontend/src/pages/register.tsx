import background from "@/assets/designs.jpg";
import { RegisterForm } from "@/components/register-form";

const Register = () => {
  return (
    <div className="grid min-h-dvh grid-cols-1 overflow-hidden lg:grid-cols-[minmax(0,45%)_minmax(0,55%)]">
      <div className="relative hidden lg:block">
        <img
          src={background}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* subtle gradient*/}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="relative flex h-full flex-col justify-end p-10 text-white">
          <p className="max-w-xs text-lg font-medium leading-snug">
            NailBabe - Get your best set
          </p>
        </div>
      </div>

      {/* Form side */}
      <div className="relative flex min-w-0 items-center justify-center bg-muted/30 px-6 py-10 sm:px-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,theme(colors.primary/10),transparent_60%)]"
        />
        <div className="w-full max-w-md">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default Register;