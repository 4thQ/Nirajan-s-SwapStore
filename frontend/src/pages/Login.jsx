import { Link, Navigate, useLocation } from "react-router-dom";
import backgroundImage from "../assets/side-image.png";
import { Field, Form, Formik } from "formik";
import { signinSchema } from "../utils/schemas";
import CustomInput from "../components/CustomInput";
import CustomPasswordInput from "../components/CustomPasswordInput";
import Button from "../components/Button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { self, signin } from "../http/api";
import { useAuthStore } from "../store";
import toast from "react-hot-toast";

const LoginPage = () => {
  const location = useLocation();
  const { refetch } = useQuery({
    queryKey: ["self"],
    queryFn: self,
    enabled: false,
    retry: 0,
  });
  const { setUser, user } = useAuthStore();

  const mutation = useMutation({
    mutationFn: signin,
    onSuccess: async () => {
      const dataPromise = await refetch();
      setUser(dataPromise.data.data.user);
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
    const returnTo = new URLSearchParams(location.search).get("returnTo") || "/dashboard";
    return <Navigate to={returnTo} />;
  }

  return (
    <div className="h-screen w-screen">
      <div className="flex flex-col items-center flex-1 h-full justify-center px-4 sm:px-0">
        <div
          className="flex rounded-lg shadow-lg w-full sm:w-3/4 lg:w-1/2 bg-white sm:mx-0"
          style={{ height: "500px" }}
        >
          <div className="flex flex-col w-full md:w-1/2 p-4">
            <div className="flex flex-col flex-1 justify-center mb-8">
              <h1 className="text-4xl text-center mb-3 ">Welcome Back</h1>
              <div className="w-full mt-4">
                <Formik
                  initialValues={{ email: "", password: "" }}
                  onSubmit={handleSubmit}
                  validationSchema={signinSchema}
                >
                  {({ isSubmitting }) => {
                    return (
                      <Form className="flex flex-col gap-y-5 mx-auto">
                        <Field name="email">
                          {({ field }) => (
                            <CustomInput
                              {...field}
                              placeholder="Company Email"
                              type="email"
                            />
                          )}
                        </Field>
                        <Field name="password">
                          {({ field }) => (
                            <CustomPasswordInput {...field} placeholder="Password" />
                          )}
                        </Field>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          isPending={mutation.isPending}
                        >
                          Sign in
                        </Button>
                      </Form>
                    );
                  }}
                </Formik>
                <div className="text-center mt-4">
                  <Link
                    className="no-underline hover:underline text-blue-dark text-xs"
                    to="/signup"
                  >
                    Do not have an account ? Signup
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

export default LoginPage;
