import { Link, Navigate, useNavigate } from "react-router-dom";
import backgroundImage from "../assets/side-image.png";
import { Field, Form, Formik } from "formik";
import { signupSchema } from "../utils/schemas";
import CustomInput from "../components/CustomInput";
import CustomPasswordInput from "../components/CustomPasswordInput";
import Button from "../components/Button";
import { useMutation } from "@tanstack/react-query";
import { signup } from "../http/api";
import toast from "react-hot-toast";
import { useAuthStore } from "../store";
import CustomSelect from "../components/CustomSelect";
import { countries } from "../utils/data";

const Signup = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      toast.success("Account created successfully!");
      navigate("/login");
    },
    onError: (err) => {
      const message = err?.response?.data?.message || "Something went wrong.";
      toast.error(message);
    },
  });

  const handleSubmit = async (values) => {
    mutation.mutate(values);
  };

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen min-w-screen my-10">
      <div className="flex flex-col items-center flex-1 h-full justify-center px-4 sm:px-0">
        <div
          className="flex rounded-lg shadow-lg w-full sm:w-3/4 lg:w-1/2 bg-white sm:mx-0"
          style={{ minheight: "500px" }}
        >
          <div className="flex flex-col w-full md:w-1/2 p-4">
            <div className="flex flex-col flex-1 justify-center mb-8">
              <h1 className="text-4xl text-center mb-3">Signup</h1>
              <div className="w-full mt-4">
                <Formik
                  initialValues={{
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    location: "",
                  }}
                  onSubmit={handleSubmit}
                  validationSchema={signupSchema}
                >
                  {({ isSubmitting }) => (
                    <Form className="flex flex-col gap-y-5 mx-auto">
                      <Field name="firstName">
                        {({ field }) => (
                          <CustomInput {...field} placeholder="First Name" type="text" />
                        )}
                      </Field>
                      <Field name="lastName">
                        {({ field }) => (
                          <CustomInput {...field} placeholder="Last Name" type="text" />
                        )}
                      </Field>
                      <Field name="email">
                        {({ field }) => (
                          <CustomInput {...field} placeholder="Email" type="email" />
                        )}
                      </Field>
                      <Field name="location">
                        {({ field }) => {
                          return (
                            <CustomSelect
                              placeholder="Select Location"
                              {...field}
                              options={countries}
                            />
                          );
                        }}
                      </Field>
                      <Field name="password">
                        {({ field }) => (
                          <CustomPasswordInput {...field} placeholder="Password" />
                        )}
                      </Field>
                      <Field name="confirmPassword">
                        {({ field }) => (
                          <CustomPasswordInput
                            {...field}
                            placeholder="Confirm Password"
                          />
                        )}
                      </Field>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        isPending={mutation.isPending}
                      >
                        Signup
                      </Button>
                    </Form>
                  )}
                </Formik>
                <div className="text-center mt-4">
                  <Link
                    className="no-underline hover:underline text-blue-dark text-xs"
                    to="/login"
                  >
                    Already have an account? Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div
            className="hidden md:block md:w-1/2 rounded-r-lg"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center center",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
