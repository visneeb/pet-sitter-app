// Builds a FormData payload the backend expects:
//    - field "body": stringified JSON with name/phone/email/password etc.
//    - field "file": the image File (optional)
//    - field "removeProfileImg": "true" if removing avatar (optional)
export function buildFormData(
  bodyJson: object,
  file?: File | null,
  removeProfileImg?: boolean,
): FormData {
  const formData = new FormData();
  formData.append("body", JSON.stringify(bodyJson));
  if (file) {
    formData.append("image", file);
  }
  if (removeProfileImg) {
    formData.append("removeProfileImg", "true");
  }
  return formData;
}
