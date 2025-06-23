import Button from 'react-bootstrap/button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/modal';
import type { TransactionSearchFormProps } from '../types/TransactionSearchFormProps';



export default function TransactionSearchForm({ show, filter, merchants, types, onClose, onSearch }: TransactionSearchFormProps) {
  let localFilter = { ...filter };

  const handleFieldChange = (fieldName: string, value: string) => {
    if ([ "toDate", "fromDate" ].includes(fieldName)) {
      localFilter = {...localFilter, [fieldName]: new Date(value)};
    } else if ( [ "toAmount", "fromAmount" ].includes(fieldName)) {
      localFilter = { ...localFilter, [fieldName]: parseFloat(value)};
    } else if (fieldName==="merchants") {
      if (localFilter.merchants.includes(value)) {
        localFilter.merchants = localFilter.merchants.filter(m => m !== value);
      } else {
        localFilter.merchants = [ ...localFilter.merchants, value];
      }
    } else if (fieldName==="types") {
      if (localFilter.merchants.includes(value)) {
        localFilter.types = localFilter.types.filter(m => m !== value);
      } else {
        localFilter.types = [ ...localFilter.types, value];
      }
    } else if (fieldName==="comments") {
      localFilter = { ...localFilter, comments: value };
    } else {
      throw new Error(`unknown field name ${fieldName}` )
    }
  };

  const getFieldGroupings = (fields: string[]): string[][] => {
    const groupings = [new Array<string>(), new Array<string>(), new Array<string>()];

    fields.forEach((field, index) => {
      const grouping = index % 3;
      groupings[grouping].push(field);
    })
    return groupings;
  }

  const merchantGroupings = getFieldGroupings(merchants);
  const typeGroupings = getFieldGroupings(types);


  const merchantFields = merchantGroupings.map((mg, i) => (
    <Form.Group as={Col}>
       { mg.map((merchant, j) => (
         <Form.Check
          label = {merchant}
          type="checkbox"
          id={`merchants-${i}-${j}`}
          onChange={() => handleFieldChange('merchants', merchant)}
        />))}
      </Form.Group>
  ));

  const typeFields = typeGroupings.map((tg, index) => (
    <Form.Group as={Col}>
       { tg.map(type => (
         <Form.Check
          label = {type}
          type="checkbox"
          id= {`types-${index}`}
          onChange={() => handleFieldChange('types', type)}
        />))}
      </Form.Group>
  ));
  
  function submitForm() {
    onSearch(localFilter);
  }

  return (
    <Form onSubmit={submitForm} name="searchForm" role="search-form">
      <Modal show={show} onHide={onClose}>
          <Modal.Header closeButton>  
            <Modal.Title>Search Transactions</Modal.Title>
          </Modal.Header>
          <Modal.Body> 
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>From Date</Form.Label>
                <Form.Control type="date" placeholder="Enter From Date" 
                  value={localFilter.fromDate?.toLocaleDateString()}
                  onChange={(e) => handleFieldChange('fromDate', e.target.value)} />
              </Form.Group>
              <Form.Group as={Col} controlId="formGrid2aasdf">
                <Form.Label>To Date</Form.Label>
                <Form.Control type="date" placeholder="Enter To Date"
                  value={localFilter.toDate?.toLocaleDateString()}
                  onChange={(e) => handleFieldChange('toDate', e.target.value)} />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>From Amount</Form.Label>
                <Form.Control type="number" placeholder="End From Amount"
                  value={localFilter.toDate?.toLocaleDateString()}
                  onChange={(e) => handleFieldChange('fromAmount', e.target.value)} />
              </Form.Group>
              <Form.Group as={Col} controlId="formGrid2aasdf">
                <Form.Label>To Amount</Form.Label>
                <Form.Control type="number" placeholder="Enter To Amount" 
                  value={localFilter.toDate?.toLocaleDateString()}
                  onChange={(e) => handleFieldChange('toAmount', e.target.value)} />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Label>Merchants</Form.Label>
              {merchantFields}  
            </Row>
            <Row className="mb-3">
              <Form.Label>Transaction Types</Form.Label>
              {typeFields}
            </Row>
            <Row className="mb-3">
              <Form.Label>Comments</Form.Label>
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Control type="text" placeholder="Comments"
                  value={localFilter.toDate?.toLocaleDateString()}
                  onChange={(e) => handleFieldChange('comments', e.target.value)} />
              </Form.Group>
            </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          {/* for some reason I can get the form to submit with the type=submit */}
          <Button variant="primary" type="submit" onClick={() => submitForm()}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </Form>
  );
}

