import React from "react"
import { useState, useEffect } from "react"
import { Card, Container, Form, Icon, Label, Segment } from "semantic-ui-react"
import { useReadCypher  } from "use-neo4j";

export const Genes = () => {

    console.log('Enter - Gene')
    console.log('============')

    type SearchGenesType = {
        query: string
    }

    const SearchGenes = ( {query } : SearchGenesType) => {
        console.log('Enter - SearchGenes')
        const { loading, error, records} = useReadCypher(
           `MATCH (g:LKP_GENE_DETAILS) WHERE g.GeneMasterName CONTAINS $name RETURN g`, {name : query})

           if (loading ) { 
            return ( 
                <div>Loading</div>
            )
           }
        
        if (loading ) { 
            return  (<div></div>)
        }

        if ( error) {
            console.log(error.message)
            return  (<div></div>)

        }

        console.log('Loading data - SearchGenes')
   
        
        const genes = records?.map( row => { 
           const gene = row.get('g')
           console.log(gene.properties)
           return (
              <Card key={gene.properties.name}>
                  <Card.Content>
                    <Card.Header>{gene.properties.GeneMasterName}</Card.Header>
                    <Card.Meta>{gene.properties.GeneFullName} </Card.Meta>
                    
                    <Card.Description>{gene.properties.Mechanism}</Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <Icon name='user' />
                    Invitae {gene.properties.In_Invitae}
                  </Card.Content>
    
              </Card>
           
           )
          

        })
        console.log('Exit - SearchGenes')
       
        return ( <div>
            {genes}
        </div>)
    }
    
    const [query, setQuery] = useState<string>('' as string)

    return ( 
        
        <Container>

            <Segment>
                <Form>
                    <Form.Field>
                        <label htmlFor="query">Search</label>
                        <input type="text" value={query} onChange={e => setQuery(e.target.value)}/>
                    </Form.Field>
                </Form>

            </Segment>
            <SearchGenes query={query} />
        </Container>
    
    )
      
} 