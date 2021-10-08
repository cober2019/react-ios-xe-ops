import { ErrorBoundary } from '../Other/errorBoundry';
import Card from "react-bootstrap/Card";

export function CreateCard(component, title){

    const card =  <Card bg="dark" className="mb-3">
                    <Card.Body>
                        <Card.Title className="mb-3">{title}</Card.Title>
                        <ErrorBoundary>
                            {component}
                        </ErrorBoundary>
                    </Card.Body>
                </Card>

    return card
    
}
