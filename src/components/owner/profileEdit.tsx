import { FormField } from "../form/form-field";
import { ActionButton } from "../ui/Button";

export default function ProfileEdit() {
  return (
    <form className="space-y-4">
      <FormField id="name" label="Your Name" required />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FormField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          required
        />
        <FormField
          id="phone"
          label="Phone"
          type="tel"
          autoComplete="tel"
          required
        />
      </div>
      <div className="flex justify-end pt-15">
        <ActionButton variant="primary" type="submit">
          Update Profile
        </ActionButton>
      </div>
    </form>
  );
}
