import ProjectsList from "@/components/app/ProjectsList";
import { FormInputField } from "@/components/FormInputField";
import Loader from "@/components/sites/Loader";
import { tenantCreateInputSchema } from "@/core/tenant/index.zod";
import { AppLayout } from "@/layouts/Layout";
import { useChangeTheme } from "@/lib/hooks/useChangeTheme";
import { useModal } from "@/lib/hooks/useModel";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import useRequireAuth from "@/lib/useRequireAuth";
import { useZodForm, ZodFormFieldConfig } from "@/lib/util/form-gen";
import { Prisma } from "@prisma/client";
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
      label:"Logo",
      upload:true,
      ordering:4
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

  const subdomain = form.watch(Prisma.TenantScalarFieldEnum.subdomain,"");

  const checkResult = trpc.tenant.checkSubDomain.useQuery(subdomain,{
    onSuccess:(data)=>{
      if(data?.subdomain){
        form.setError(Prisma.TenantScalarFieldEnum.subdomain,{
          message:"Subdomain is not available",
          type:"deps"
        },{shouldFocus:true})
      }else{
        const error = form.getFieldState(Prisma.TenantScalarFieldEnum.subdomain).error;
         if(error?.type==="deps"){
        form.clearErrors(Prisma.TenantScalarFieldEnum.subdomain)
         }
      }
    }
  });

  const url = new URL(process.env.NEXT_PUBLIC_HOST!);

  return (

    <form
      onSubmit={form.handleSubmit(
        async (data) => {
          //submit here   
          if(checkResult.data?.subdomain){
            form.setError(Prisma.TenantScalarFieldEnum.subdomain,{
              message:"Subdomain is not available",
              type:"deps"
            },{shouldFocus:true})
            return;
          }
          await result.mutateAsync(data as any);
        },
        (e) => {
          console.error(e);
        }
      )}
    >
      <div className="w-full font-semibold text-base"> Create Business</div>
      <div className="grid grid-flow-row grid-cols-1   gap-3">
        {config.map((i) => {
          if(i.name === "subdomain")
          {
            return <div className="flex flex-row item-center"> 
            <FormInputField key={i.name} {...i} />
            <div className="flex flex-col justify-start"><span className="text-info text-xl pl-2 mt-10 text-center ml-1  ">.{url.hostname}</span></div>
            </div>;

          }
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
        <button type="submit" disabled={checkResult.isLoading} className="btn btn-sm btn-success">
          {checkResult.isLoading?"Validating..":"Save"}
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



function SubdomainField({hostname,subdomain,config}:{hostname:string,subdomain:string,config:ZodFormFieldConfig}){
  const trpc = useTrpcTenant();
  const result = trpc.tenant.checkSubDomain.useQuery(subdomain);

  return <div className="flex flex-row item-center"> 
            <FormInputField {...config} />
            <div className="flex flex-col justify-start"><span className="text-info text-xl pl-2 mt-10 text-center ml-1  ">.{hostname}</span></div>
            </div>;
}



