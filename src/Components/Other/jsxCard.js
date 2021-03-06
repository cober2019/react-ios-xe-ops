import { ErrorBoundary } from  'react-error-boundary'
import Card from "react-bootstrap/Card";
import { IsErrorFallback } from "../Other/errorComponent";

export function CreateCard(component, title, extra){

    const card =  <Card bg="dark" className="mb-3 border-0">
                    <Card.Body>
                        <Card.Title className="mb-3">{title}</Card.Title>
                        {extra}
                        <ErrorBoundary  FallbackComponent={IsErrorFallback}>
                            {component}
                        </ErrorBoundary>
                    </Card.Body>
                </Card>

    return card
    
}
