import { Field, Form, Formik } from "formik";
import CustomInput from "../components/CustomInput";
import Button from "../components/Button";
import { useAuthStore } from "../store";
import CustomSelect from "../components/CustomSelect";
import { countries } from "../utils/data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../http/api";
import toast from "react-hot-toast";
import { profileSchema } from "../utils/schemas";

const ProfilePage = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries("self");
      toast.success("Profile Updated successfully!");
    },
    onError: (err) => {
      const message = err?.response?.data?.message || "Something went wrong.";
      toast.error(message);
    },
  });

  const handleSubmit = async (values) => {
    const formData = new FormData();
    for (const key in values) {
      if (key === "image" && values[key] instanceof File) {
        formData.append(key, values[key]);
      } else {
        formData.append(key, values[key]);
      }
    }
    mutation.mutate(formData);
  };

  const { user } = useAuthStore();

  return (
    <div>
      <div className="flex flex-col flex-1 justify-center mb-8 w-[400px] max-w-[95%] mx-auto">
        <h1 className="text-4xl text-center mb-3 font-semibold uppercase">Profile</h1>
        <div className="w-full mt-4">
          <Formik
            initialValues={{
              firstName: user?.firstName || "",
              lastName: user?.lastName || "",
              email: user?.email || "",
              location: user?.location || "",
              image: null, // Initialize with null
            }}
            onSubmit={handleSubmit}
            validationSchema={profileSchema}
          >
            {({ setFieldValue, isSubmitting }) => (
              <Form className="flex flex-col gap-y-5 mx-auto">
                <Field name="firstName">
                  {({ field }) => (
                    <CustomInput
                      {...field}
                      placeholder="First Name"
                      type="text"
                      label="First Name:"
                    />
                  )}
                </Field>
                <Field name="lastName">
                  {({ field }) => (
                    <CustomInput
                      {...field}
                      placeholder="Last Name"
                      type="text"
                      label="Last Name:"
                    />
                  )}
                </Field>
                <Field name="email">
                  {({ field }) => (
                    <CustomInput
                      {...field}
                      placeholder="Email"
                      type="email"
                      label="Email:"
                    />
                  )}
                </Field>
                <Field name="location">
                  {({ field }) => (
                    <CustomSelect
                      placeholder="Select Location"
                      {...field}
                      options={countries}
                      label="Location:"
                    />
                  )}
                </Field>
                <div>
                  <label htmlFor="image">Profile Image:</label>
                  <input
                    id="image"
                    name="image"
                    type="file"
                    onChange={(event) => {
                      setFieldValue("image", event.currentTarget.files[0]);
                    }}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  isPending={mutation.isPending}
                >
                  Update
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
