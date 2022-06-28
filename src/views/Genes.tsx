import React from "react"
import { useState, useEffect } from "react"
import { Card, Container, Form, Icon, Label, Segment } from "semantic-ui-react"
import { useReadCypher,useLazyReadCypher  } from "use-neo4j";
import { Driver } from 'neo4j-driver'

export const Genes = () => {

    // const session = driver.session()
    type SearchGenesType = {
        query: string
    }

    const SearchGenes = ( {query } : SearchGenesType) => {
        const { loading, records} = useReadCypher(
           `MATCH (g:Gene) WHERE g.name CONTAINS $name RETURN g`, {name : query})

           if (loading ) { 
            return ( 
                <div>Loading</div>
            )
           }
           
        const genes = records?.map( row => { 
           const gene = row.get('g')
           return (
              <Card key={gene.properties.name}>
                  <Card.Content>
                    <Card.Header>{gene.properties.name}</Card.Header>
                    <Card.Meta>CARD META</Card.Meta>
                    <Card.Description>CARD DESCRIPTION</Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <Icon name='user' />
                    Constent extra
                  </Card.Content>
    
              </Card>
           
           )
        })
       
        return ( <div>
            {genes}
        </div>)
    }
    


    
    
    const [query, setQuery] = useState<string>('' as string)
    console.log('useState $query', query)


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