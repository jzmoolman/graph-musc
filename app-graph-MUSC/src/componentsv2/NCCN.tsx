

import React, { 
    useContext,
    useEffect,
    useState } from 'react'

import { 
    styled,
    Table,
    TableBody,
    TableCell,
    tableCellClasses,
    TableHead,
    TableRow } from '@mui/material'

import { Neo4jContext } from 'use-neo4j'
import { 
    cardNCCNDataObjectV2,
    cardNCCNTableObjectV2,
    loadNCCNDataV2 } from '../experimental/nccn.neo4j'


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      fontWeight: "normal",
    },
  }));

  const StyledTableCell2 = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
      fontWeight: "bold",
      //webkitFontSmoothing: "antialiased",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      fontWeight: "bold",
      color: "black"
    },
  }));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(n)': {
        backgroundColor: "rgba(0, 0, 0, 0.1)",
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));


const StyledTableRow2 = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(n)': {
        backgroundColor: "rgba(0, 0, 0, 0.1)", ///  "rgba(0, 0, 0, 0.3)", 119,136,153, 128,128,128, 255,250,205, 255,255,224
        fontWeight: "bold",
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
        fontWeight: "bold",
    },
}));

type NCCNTableProps = {
    data: cardNCCNDataObjectV2[]
}

export const NCCNTable = ({data}:NCCNTableProps) => {

    return (<>
    
    <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
            <TableRow>
                <StyledTableCell align="center">Organ/Modality</StyledTableCell>
                <StyledTableCell align="center">Gender</StyledTableCell>
                <StyledTableCell align="center">Recommendation</StyledTableCell>
            </TableRow>
        </TableHead>
        <TableBody>

            {data.map((row) => {
                
                const nccnRender = []
                
                if (row.organ_specialist === "1")
                {
                    nccnRender.push (<StyledTableRow2 key={row.organ}>
                        <StyledTableCell2 colSpan={3} align="justify" component="th" scope="row" >{row.organ}</StyledTableCell2>
                        </StyledTableRow2>
                        );

                    row.data.forEach((element)  => {
                            nccnRender.push(
                                <TableRow key={element.modality}>
                                <StyledTableCell2 component="th" scope="row">{element.modality}</StyledTableCell2>
                                <StyledTableCell2 align="justify">{element.gender}</StyledTableCell2>
                                <StyledTableCell2 align="justify">{element.recommendation}</StyledTableCell2>
                                </TableRow>
                            );
                        });
                }  
                else {
                    nccnRender.push(<StyledTableRow key={row.organ}>
                        <StyledTableCell colSpan={3} align="justify" component="th" scope="row">{row.organ}</StyledTableCell>
                        </StyledTableRow>
                    );

                    row.data.forEach((element)  => {
                        nccnRender.push(
                            <TableRow key={element.modality}>
                            <StyledTableCell component="th" scope="row">{element.modality}</StyledTableCell>
                            <StyledTableCell align="justify">{element.gender}</StyledTableCell>
                            <StyledTableCell align="justify">{element.recommendation}</StyledTableCell>
                            </TableRow>
                        );
                    });
                }
                return ( nccnRender )                
            })}

        </TableBody>    
    </Table>
</>)

}

type NCCNProps = {
    gene: string
}

export const NCCN = ( {gene}: NCCNProps) => {

    const context = useContext(Neo4jContext), driver = context.driver
    const [data, setData] = useState<any>(null)

    function handleData(data:any[]) {
        // console.log('----->handleData', data)
        setData(data)
    }
    
    useEffect(()=>{
        loadNCCNDataV2(driver, gene, 'Confirmed', '', handleData)

    },[])

    let footNoteArray : JSX.Element[] = []; 
   
    if ( data ) {

        const unique_footnote = Array.from(new Set(data.map((item: { footnote: any }) => item.footnote)));
        unique_footnote.forEach((row:any) => {
            footNoteArray.push(
                <div key={row} className="NCCNCard">
                    {row}
                    <br/>
                </div>)
        })

    }

    return (<div> 
        {data?<>
            <NCCNTable data={data}/>
            <div>
                {footNoteArray}
            </div>
        </>
        :<span> Loading...</span>}


      </div>
    )


}