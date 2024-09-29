import { signInAction } from "../_lib/action";

// Note: We can not connect the "signIn" function from "NextAuth" library by adding "onClick" because we want the entire flow stays on server side so we need to create a "server action". They allow us to add interactivity to server components and usually to forms.
function SignInButton() {
  return (
    <form action={signInAction}>
      <button className="flex items-center gap-6 text-lg border border-primary-300 px-10 py-4 font-medium">
        <img
          src="https://authjs.dev/img/providers/google.svg"
          alt="Google logo"
          height="24"
          width="24"
        />
        <span>Continue with Google</span>
      </button>
    </form>
  );
}

export default SignInButton;
