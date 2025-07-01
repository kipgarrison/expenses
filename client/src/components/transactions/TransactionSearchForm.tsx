import Button from 'react-bootstrap/button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/modal';
import { useEffect, useState } from 'react';
import type { ReferenceData } from '../../types/app/ReferenceData';
import type { TransactionSearchFormProps } from '../../types/TransactionSearchFormProps';



export default function TransactionSearchForm({ show, filter, merchants, categories, onClose, onSearch }: TransactionSearchFormProps) {
  useEffect(() => {
    updateFilter(filter);
  }, [filter]);
  
  const [ localFilter, updateFilter ] = useState(filter)

  const handleFieldChange = (fieldName: string, value: string|ReferenceData) => {
    if ([ "toDate", "fromDate" ].includes(fieldName)) {
      //const date = isNaN(new Date(value).getTime()) ?  undefined : new Date(value);
      updateFilter({...localFilter, [fieldName]: value});
    } else 
    if ( [ "toAmount", "fromAmount" ].includes(fieldName)) {
      updateFilter({ ...localFilter, [fieldName]: parseFloat(value as string)});
    } else if (fieldName==="merchants") {
      let merchants = [];
      const merchant = value as ReferenceData;
      if (localFilter.merchants.includes(value as ReferenceData)) {
        merchants = localFilter.merchants.filter(m => m !== value);
      } else {
        merchants = [ ...localFilter.merchants, merchant];
      }
      updateFilter( { ...localFilter, merchants });
    } else if (fieldName==="categories") {
      let categories = [];
      const category = value as ReferenceData;
      if (localFilter.categories.includes(category)) {
        categories = localFilter.categories.filter(m => m !== value);
      } else {
        categories = [ ...localFilter.categories, category];
      }
      updateFilter( { ...localFilter, categories})
    } else if (fieldName==="comments") {
      updateFilter({ ...localFilter, comments: value as string});
    } else {
      throw new Error(`unknown field name ${fieldName}` )
    }
  };

  const getFieldGroupings = (fields: ReferenceData[]): ReferenceData[][] => {
    const groupings = [new Array<ReferenceData>(), new Array<ReferenceData>(), new Array<ReferenceData>()];

    fields.forEach((field, index) => {
      const grouping = index % 3;
      groupings[grouping].push(field);
    })
    return groupings;
  }

  const merchantGroupings = getFieldGroupings(merchants);
  const categoryGroupings = getFieldGroupings(categories);


  const merchantFields = merchantGroupings.map((mg) => (
    <Form.Group as={Col}>
       { mg.filter(mg => mg.name !== "N/A").map((merchant) => (
         <Form.Check
          key = {merchant.id}
          label = {merchant.name}
          type="switch"
          id={`merchants-${merchant.id}`}
          checked={ localFilter.merchants.includes(merchant) }
          onChange={() => handleFieldChange('merchants', merchant)}
        />))}
      </Form.Group>
  ));

  const categoryFields = categoryGroupings.map((cg) => (
    <Form.Group as={Col}>
       { cg.map((category)  => (
         <Form.Check
          key={category.id}
          label = {category.name}
          type="switch"
          checked={ localFilter.categories.includes(category) }
          id= {`category-${category.id}`}
          onChange={() => handleFieldChange('categories', category)}
        />))}
      </Form.Group>
  ));
  
  function submitForm() {
    onSearch({ ...localFilter });
  }

  function getDisplayValue(value: string | number | undefined): string {
    if (!value) return "";
    return value.toString();
  }
  return (
    
    <Form onSubmit={submitForm} name="searchForm" role="search-form">
      <Modal show={show} onHide={onClose}>
          <Modal.Header closeButton>  
            <Modal.Title>Search Transactions</Modal.Title>
          </Modal.Header>
          <Modal.Body> 
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>From Date</Form.Label>
                <Form.Control type="date" placeholder="Enter From Date" 
                  value={getDisplayValue(localFilter.fromDate)}
                  // onBlur={(e) => handleFieldChange('fromDate', e.target.value)} />
                  onChange={(e) => handleFieldChange('fromDate', e.target.value)} />
              </Form.Group>
              <Form.Group as={Col}>
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
              <Form.Label>Categories</Form.Label>
              {categoryFields}
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

