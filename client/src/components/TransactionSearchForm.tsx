import Button from 'react-bootstrap/button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/modal';
import type { TransactionSearchFormProps } from '../types/TransactionSearchFormProps';
import { useState } from 'react';


export default function TransactionSearchForm({ show, filter, merchants, types, onClose, onSearch }: TransactionSearchFormProps) {
  const [ localFilter, updateFilter ] = useState(filter)

  const handleFieldChange = (fieldName: string, value: string) => {
    if ([ "toDate", "fromDate" ].includes(fieldName)) {
      //const date = isNaN(new Date(value).getTime()) ?  undefined : new Date(value);
      updateFilter({...localFilter, [fieldName]: value});
    } else 
    if ( [ "toAmount", "fromAmount" ].includes(fieldName)) {
      updateFilter({ ...localFilter, [fieldName]: parseFloat(value)});
    } else if (fieldName==="merchants") {
      let merchants = [];
      if (localFilter.merchants.includes(value)) {
        merchants = localFilter.merchants.filter(m => m !== value);
      } else {
        merchants = [ ...localFilter.merchants, value];
      }
      updateFilter( { ...localFilter, merchants });
    } else if (fieldName==="types") {
      let types = [];
      if (localFilter.types.includes(value)) {
        types = localFilter.types.filter(m => m !== value);
      } else {
        types = [ ...localFilter.types, value];
      }
      updateFilter( { ...localFilter, types})
    } else if (fieldName==="comments") {
      updateFilter({ ...localFilter, comments: value });
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
          checked={ localFilter.merchants.includes(merchant) }
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
          checked={ localFilter.types.includes(type) }
          id= {`types-${index}`}
          onChange={() => handleFieldChange('types', type)}
        />))}
      </Form.Group>
  ));
  
  function submitForm() {
    onSearch({ ...localFilter });
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
                  value={localFilter.fromDate}
                  // onBlur={(e) => handleFieldChange('fromDate', e.target.value)} />
                  onChange={(e) => handleFieldChange('fromDate', e.target.value)} />
              </Form.Group>
              <Form.Group as={Col} controlId="formGrid2aasdf">
                <Form.Label>To Date</Form.Label>
                <Form.Control type="date" placeholder="Enter To Date"
                  value={localFilter.toDate}
                  onChange={(e) => handleFieldChange('toDate', e.target.value)} />
                  {/* onChange={(e) => handleFieldChange('toDate', e.target.value)} /> */}
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>From Amount</Form.Label>
                <Form.Control type="number" placeholder="Enter From Amount"
                  value={localFilter.fromAmount}
                  onChange={(e) => handleFieldChange('fromAmount', e.target.value)} />
              </Form.Group>
              <Form.Group as={Col} controlId="formGrid2aasdf">
                <Form.Label>To Amount</Form.Label>
                <Form.Control type="number" placeholder="Enter To Amount" 
                  value={localFilter.toAmount}
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
                  value={localFilter.comments}
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

