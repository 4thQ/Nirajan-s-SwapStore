import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getItem, getMyAvailableItem, placeSwapOrder } from "../../http/api";
import { Field, Form, Formik } from "formik";
import CustomInput from "../../components/CustomInput";
import Button from "../../components/Button";
import { swapOrderSchema } from "../../utils/schemas";
import CustomTextArea from "../../components/CustomTextArea";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store";
import CustomSelect from "../../components/CustomSelect";

const SwapOrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data, isLoading } = useQuery({
    queryKey: ["items", id],
    queryFn: async () => {
      return getItem(id);
    },
    retry: 0,
  });

  const { data: myItems } = useQuery({
    queryKey: ["items", user?.id],
    queryFn: getMyAvailableItem,
    retry: 0,
  });

  const mutation = useMutation({
    mutationFn: placeSwapOrder,
    onSuccess: () => {
      toast.success("Swap order placed successfully.");
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
        <div className="flex gap-3 my-4 h-screen w-screen justify-center items-center ">
          <div className="loader"></div>
          <p className="font-semibold text-xl ml-3 uppercase">Item is loading....</p>
        </div>
      </div>
    );
  }
  const item = data?.data;

  const myItemsOptions = myItems?.data?.map((item) => {
    return {
      label: item?.name,
      value: item?._id,
    };
  });

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
          swapWith: "",
        }}
        onSubmit={handleSubmit}
        validationSchema={swapOrderSchema}
      >
        {() => (
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
            <Field name="swapWith">
              {({ field }) => {
                return (
                  <CustomSelect label="Swap With:" {...field} options={myItemsOptions} />
                );
              }}
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

            <Button type="submit" width="200px" isPending={mutation.isPending}>
              Place Swap Order
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SwapOrderPage;
