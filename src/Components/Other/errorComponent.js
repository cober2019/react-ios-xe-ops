
import Card from "react-bootstrap/Card";


export function IsErrorFallback(){

    return <Card bg="dark" className="mb-3" style={{height: '500px'}}>
            <Card.Body>
            <h3 class="text-center fade-in" style={{marginTop: 185, color: "orange", fontWeight: "bold"}}>!Something Went Wrong. Please Refresh!</h3>
            </Card.Body>
        </Card>
}