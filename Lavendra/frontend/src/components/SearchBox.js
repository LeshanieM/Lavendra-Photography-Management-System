/*import React, { useState } from 'react';
 import Button from 'react-bootstrap/Button';
 import Form from 'react-bootstrap/Form';
 import InputGroup from 'react-bootstrap/InputGroup';
 import FormControl from 'react-bootstrap/FormControl';
 import { useNavigate } from 'react-router-dom';
 
 export default function SearchBox() {
   const navigate = useNavigate();
   const [query, setQuery] = useState('');
   const submitHandler = (e) => {
     e.preventDefault();
     navigate(query ? `/search/?query=${query}` : '/search'); 
   };
 
   return (
     <Form className="d-flex me-auto" onSubmit={submitHandler}>
       <InputGroup>
         <FormControl
           type="text"
           name="q"
           id="q"
           onChange={(e) => setQuery(e.target.value)}
           placeholder="search products..."
           aria-label="Search Products"
           aria-describedby="button-search"
         ></FormControl>
         <Button variant="outline-primary" type="submit" id="button-search">
           <i className="fas fa-search"></i>
         </Button>
       </InputGroup>
     </Form>
   );
 }*/

   import React, { useState } from 'react';
   import Button from 'react-bootstrap/Button';
   import Form from 'react-bootstrap/Form';
   import InputGroup from 'react-bootstrap/InputGroup';
   import FormControl from 'react-bootstrap/FormControl';
   import { useNavigate } from 'react-router-dom';
   
   export default function SearchBox() {
     const navigate = useNavigate();
     const [query, setQuery] = useState('');
   
     const submitHandler = (e) => {
       e.preventDefault();
       const trimmedQuery = query.trim();
       
       // Navigate using an object with `pathname` and `search`
       navigate({
         pathname: '/search',
         search: trimmedQuery ? `?query=${encodeURIComponent(trimmedQuery)}` : '',
       });
     };
   
     return (
       <Form className="d-flex me-auto" onSubmit={submitHandler}>
         <InputGroup>
           <FormControl
             type="text"
             name="q"
             id="q"
             onChange={(e) => setQuery(e.target.value)}
             placeholder="Search products..."
             aria-label="Search Products"
             aria-describedby="button-search"
             value={query} // Controlled input
           />
           <Button variant="outline-primary" type="submit" id="button-search" aria-label="Search">
             <i className="fas fa-search"></i>
           </Button>
         </InputGroup>
       </Form>
     );
   }