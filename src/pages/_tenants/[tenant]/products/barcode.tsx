import { FormContainer } from "@/components/FormContainer";
import { getLayout } from "@/layouts/getLayout"


export default function Barcode(){
    return( <FormContainer title={<h2>Print Barcode</h2>}>barcode</FormContainer>)
}

Barcode.getLayout = getLayout;