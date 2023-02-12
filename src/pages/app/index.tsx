import ProjectsList from "@/components/app/ProjectsList";
import { FormInputField } from "@/components/FormInputField";
import Loader from "@/components/sites/Loader";
import { tenantCreateInputSchema } from "@/core/tenant/index.zod";
import { AppLayout } from "@/layouts/Layout";
import { useChangeTheme } from "@/lib/hooks/useChangeTheme";
import { useModal } from "@/lib/hooks/useModel";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import useRequireAuth from "@/lib/useRequireAuth";
import { useZodForm } from "@/lib/util/form-gen";
import { Session } from "next-auth";
import { FC, ReactNode, useState } from "react";

export default function Index() {
  useChangeTheme();
  const session = useRequireAuth();
  const [show, hide, data] = useModal();

  if (!session) return <Loader />;

  return (
    <div className="flex justify-center w-full">
      <div className=" md:w-full max-w-4xl">
        <ProjectsList
          id={session.user!.id!}
          onManage={(e) => {}}
          onNewProject={({refetch}) => {
            show({
              content: ({
                hide,
                ModalContainer,
                ModalContent,
                ModalAction,
              }) => {
                return (
                  <ModalContainer>
                    <ModalContent>
                      <TenantForm refetch={refetch} session={session} ModalAction={ModalAction} hide={hide} />
                    </ModalContent>
                  </ModalContainer>
                );
              },
            });
          }}
        />
      </div>
    </div>
  );
}

function TenantForm({
  refetch,
  session,
  ModalAction,
  hide,
}: {
  refetch:()=>void,
  session: Session;
  ModalAction: FC<any>;
  hide: () => void;
}) {
  const [config, form] = useZodForm(tenantCreateInputSchema, {
    imageBlurhash: {
      hidden: true,
    },
    customDomain: {
      hidden: true,
    },
    userId: {
      hidden: true,
      registerOptions: {
        value: session?.user?.id,
      },
    },
    image: {
      hidden: true,
    },
    name:{
      label:"Business name",
      ordering:1
    },
    subdomain: {
      label: "Subdomain",
      ordering:2,
    },
    logo:{
      hidden:true
    },
    description:{
      label:"Description",
      textArea:true,
      ordering:5
    },
    
  });
 const [error,setError] = useState("");
 const [success,setSuccess] = useState("");
  const trpc = useTrpcTenant();
  const result = trpc.tenant.create.useMutation({
    onSuccess:(data)=>{
      setSuccess("Businesss created successfully")
      refetch();
      setTimeout(()=>{
        hide();
      },3000)
    },
    onError:(error)=>{
      setError("Failed to create ")
    }
  })
  return (

    <form
      onSubmit={form.handleSubmit(
        async (data) => {
          //submit here
          await result.mutateAsync(data as any);
        },
        (e) => {
          console.error(e);
        }
      )}
    >
      <div className="w-full font-semibold text-base"> Create Business</div>
      <div className="grid grid-flow-row xs:grid-cols-1  sm:grid-cols-2 gap-3">
        {config.map((i) => {
          return <FormInputField key={i.name} {...i} />;
        })}
      </div>
      <ModalAction>
        <button
          className="btn btn-sm btn-warning btn-outline"
          onClick={(e) => {
            e.preventDefault();
            hide();
          }}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-sm btn-success">
          Save
        </button>
      </ModalAction>
      {error&& <div className="w-full text-center text-error">
        {error}
      </div>}
      {success&& <div className="w-full text-center text-success">
        {success}
      </div>}
      {result.isLoading&& <div className="w-full text-center text-success">
        Submitting...
      </div>}
    </form>
  );
}

Index.getLayout = (Page: ReactNode) => {
  return <AppLayout>{Page}</AppLayout>;
};
