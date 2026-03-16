"use client";

import { useFormContext } from "react-hook-form";
import type { PetFormValues } from "@/types/pet";
import {
  AvatarUpload,
  DatePicker,
  Input,
  Select,
  Textarea,
} from "@/components/form";
import { ActionButton, NavigationButton } from "@/components/ui/Button";
import { PawPrint, Trash } from "lucide-react";
import cn from "@/utils/cn";

const sexes = ["Male", "Female", "Unknown"];

interface Props {
  mode: "create" | "edit";
  petTypes: { id: number; name: string }[];
}

const deletePetDialog = () => {
  const dialog = document.getElementById(
    "delete-pet",
  ) as HTMLDialogElement | null;

  if (!dialog) return;

  dialog.showModal();
};

function PetFields(props: Props) {
  const {
    formState: { errors },
  } = useFormContext<PetFormValues>();

  return (
    <>
      <div className="flex flex-col gap-4 lg:gap-10">
        <AvatarUpload
          sampleImage={
            <PawPrint className="size-12 lg:size-27 text-white -rotate-45" />
          }
          name="img_url"
        />
        <Input
          name="petName"
          label="Pet Name"
          placeholder="Your pet name"
          error={errors.petName?.message}
          required
        />
        <div className="flex flex-col grid-cols-2 gap-x-8 gap-y-4 md:grid lg:flex lg:gap-10 xl:grid">
          <Select
            name="petTypeId"
            label="Pet Type"
            placeholder="Select type of your pet"
            required
          >
            {props.petTypes.map((petType) => (
              <option key={petType.id} value={petType.id}>
                <span className="style-input">{petType.name}</span>
              </option>
            ))}
          </Select>
          <Input
            name="breed"
            label="Breed"
            placeholder="Breed of your pet"
            error={errors.breed?.message}
            required
          />
          <Select
            name="sex"
            label="Sex"
            placeholder="Select sex of your pet"
            required
          >
            {sexes.map((sex) => (
              <option key={sex} value={sex}>
                <span className="style-input">{sex}</span>
              </option>
            ))}
          </Select>
          <DatePicker
            name="dateOfBirth"
            label="Date Of Birth"
            placeholder="Select date"
            endMonth={new Date()}
            required
          />
          <Input
            name="color"
            label="Color"
            placeholder="Describe color of your pet"
            error={errors.color?.message}
            required
          />
          <Input
            name="weight"
            label="Weight (Kilogram)"
            placeholder="Weight of your pet"
            error={errors.weight?.message}
            required
          />
        </div>
        <Textarea
          name="about"
          label="About"
          placeholder="Describe more about your pet..."
          className="h-35"
        />
        {props.mode === "edit" && (
          <ActionButton
            type="button"
            onClick={deletePetDialog}
            variant="ghost"
            className="w-fit"
          >
            <Trash />
            Delete Pet
          </ActionButton>
        )}
        <div className="flex justify-between gap-4">
          <NavigationButton
            variant="secondary"
            href="/pets"
            className="flex-1 sm:flex-0 sm:min-w-30"
          >
            Cancel
          </NavigationButton>
          <ActionButton
            variant="primary"
            type="submit"
            className={cn(
              "flex-1 sm:flex-0",
              props.mode === "edit" ? "sm:min-w-36" : "sm:min-w-32",
            )}
          >
            {props.mode === "edit" ? "Update Pet" : "Create Pet"}
          </ActionButton>
        </div>
      </div>
    </>
  );
}

export default PetFields;
