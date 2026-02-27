"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { PawPrint } from "lucide-react";
import {
  Form,
  Input,
  Select,
  Textarea,
  Submit,
  BasicAvatarUpload,
} from "@/components/form";
import { NavigationButton } from "@/components/ui/Button";
import { useScreenContext } from "@/contexts/ScreenContext";

type PetFormValues = {
  name: string;
  type: string;
  breed: string;
  sex: string;
  age: string;
  color: string;
  weight: string;
  description: string;
  image: File | null;
};

function PetCreateForm() {
  const router = useRouter();
  const { isLarge } = useScreenContext();

  const methods = useForm<PetFormValues>({
    defaultValues: {
      name: "",
      type: "",
      breed: "",
      sex: "",
      age: "",
      color: "",
      weight: "",
      description: "",
      image: null,
    },
  });

  const onSubmit = () => {
    router.push("/pets");
  };

  return (
    <div
      className={`flex flex-col ${isLarge ? "gap-[60px] p-[40px]" : "gap-[24px] px-[16px] py-[24px] -mx-10"}  rounded-2xl`}
    >
      <BasicAvatarUpload
        value={methods.watch("image")}
        onChange={(file) => methods.setValue("image", file)}
        sampleImage={<PawPrint className="text-white w-[104px] h-[104px]" />}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        <div className="flex flex-col gap-[40px]">
          <Input<PetFormValues>
            name="name"
            label="Pet Name"
            placeholder="John Snow"
            required
          />

          <div
            className={`grid  ${isLarge ? "grid-cols-2 gap-[40px]" : "grid-cols-1 gap-[18px]"}`}
          >
            <Select<PetFormValues> name="type" label="Pet Type" required>
              <option value="">Select your pet type</option>
              <option value="cat">Cat</option>
              <option value="dog">Dog</option>
              {/*ไม่รู้ว่าต้อง Type อะไรบ้าง*/}
            </Select>

            <Input<PetFormValues>
              name="breed"
              label="Breed"
              placeholder="Breed of your pet"
              required
            />

            <Select<PetFormValues> name="sex" label="Sex" required>
              <option value="">Select sex of your pet</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </Select>

            <Input<PetFormValues>
              name="age"
              label="Age (Month)"
              placeholder="Age of your pet"
              required
            />

            <Input<PetFormValues>
              name="color"
              label="Color"
              placeholder="Describe color of your pet"
              required
            />

            <Input<PetFormValues>
              name="weight"
              label="Weight (Kilogram)"
              placeholder="Weight of your pet"
              required
            />
            <div
              className={`border-t border-gray-200 col-span-full ${isLarge ? "pt-[32px]" : "pt-[24px]"}`}
            >
              <Textarea<PetFormValues>
                name="description"
                label="About"
                placeholder="Describe more about your pet..."
                rows={4}
              />
            </div>
          </div>

          <div
            className={`flex justify-between ${isLarge ? "" : "gap-[16px]"}`}
          >
            <NavigationButton
              variant="secondary"
              href="/pets"
              className={
                isLarge ? "" : "flex-1 min-w-[120px] px-[24px] py-[12px]"
              }
            >
              Cancel
            </NavigationButton>
            <Submit
              className={
                isLarge ? "" : "flex-1 min-w-[120px] px-[24px] py-[12px]"
              }
            >
              Create Post
            </Submit>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default PetCreateForm;
