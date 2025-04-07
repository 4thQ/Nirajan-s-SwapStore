import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getItem, placeRentOrder } from "../../http/api";
import { Field, Form, Formik } from "formik";
import CustomInput from "../../components/CustomInput";
import Button from "../../components/Button";
import { rentOrderSchema } from "../../utils/schemas"; // Update this schema
import CustomTextArea from "../../components/CustomTextArea";
import toast from "react-hot-toast";

const RentOrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["items", id],
    queryFn: async () => {
      return getItem(id);
    },
    retry: 0,
  });

  const mutation = useMutation({
    mutationFn: placeRentOrder,
    onSuccess: () => {
      toast.success("Rental order placed successfully.");
      navigate("/dashboard/my-orders");
    },
    onError: (err) => {
      const message = err?.response?.data?.message || "Something went wrong.";
      toast.error(message);
    },
  });

  function handleSubmit(values) {
    mutation.mutate({
      ...values,
      itemId: item?._id,
    });
  }

  if (isLoading) {
    return (
      <div className="overflow-hidden">
        <div className="flex gap-3 my-4  h-screen w-screen justify-center items-center">
          <div className="loader"></div>
          <p className="font-semibold text-xl ml-3 uppercase">Item is loading....</p>
        </div>
      </div>
    );
  }
  const item = data?.data;

  return (
    <div className="container">
      <h1 className="text-2xl font-semibold my-10">Order Details</h1>
      <div className="flex gap-6 items-center">
        <img src={item?.images?.[0]} alt="" className="w-40 h-40" />
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{item?.name}</h1>
          {item?.discount ? (
            <p>
              <span className="text-3xl font-bold text-slate-900">${item?.discount}</span>
              <span className="text-sm text-slate-900 line-through">${item?.price}</span>
            </p>
          ) : (
            <p>
              <span className="text-3xl font-bold text-slate-900">${item?.price}</span>
            </p>
          )}
        </div>
      </div>

      <Formik
        initialValues={{
          phoneNumber: "",
          address: "",
          message: "",
          rentDuration: "",
        }}
        onSubmit={handleSubmit}
        validationSchema={rentOrderSchema}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-y-5 mx-auto my-10">
            <Field name="phoneNumber">
              {({ field }) => (
                <CustomInput
                  label="Phone Number:"
                  {...field}
                  placeholder="Phone Number"
                  type="text"
                />
              )}
            </Field>

            <Field name="address">
              {({ field }) => (
                <CustomInput
                  label="Address:"
                  {...field}
                  placeholder="Address"
                  type="text"
                />
              )}
            </Field>

            <Field name="message">
              {({ field }) => (
                <CustomTextArea
                  label="Message:"
                  {...field}
                  placeholder="Additional message or note (optional)"
                />
              )}
            </Field>

            <Field name="rentDuration">
              {({ field }) => (
                <CustomInput
                  label="Rent Duration (days):"
                  {...field}
                  placeholder="Number of days"
                  type="number"
                />
              )}
            </Field>

            <Button
              type="submit"
              width="200px"
              disabled={isSubmitting}
              isPending={mutation.isPending}
            >
              Place Rental Order
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RentOrderPage;
