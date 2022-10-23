import { Box, Typography, Paper } from  "@mui/material"
import { useNavigate } from 'react-router-dom'
import musc from '../assets/musc.png'

export const MuscHeader = () => {
    const navigate = useNavigate()


    const handleImageClick = () => {
        navigate('/')
    }

    return (<>

      <Paper 
          elevation={4}         
          sx={{ 
                  color: 'white',
                  backgroundColor: 'white',
                  margin: '2px',
                  padding:'2px'}}
      >
          <Box id='heading1' display='flex' 
              sx={{
                  backgroundColor:'white',
                  color: 'black'}}
          >
              <Box display='flex' 
                  sx={{
                      backgroundColor:'white'}}>
                  <img src={musc} height={100}  onClick={handleImageClick}/>
              </Box>
              <Box display='flex' flex='1' flexDirection='column'>
                  <Typography 
                      textAlign='right'
                      width='100%'
                      color='primary.main'
                      component='div'
                  >
                      <Box>
                          Created by
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          &nbsp;&nbsp;&nbsp;&nbsp;  
                          Zach Moolman
                      </Box>
                      <Box>
                          Armando Diaz 
                      </Box>
                      <Box>
                          Julie Henderson
                      </Box>
                      <Box>
                          Kiersten Meeder
                      </Box> 
                      <Box>
                          Kevin S. Hughes, MD, FACS
                      </Box> 
                  </Typography>
              </Box>
              <Box display='flex' flex='1' flexDirection='column'>
                  <Typography 
                      textAlign='right'
                      width='100%'
                      color='primary.main'
                      component='div'
                  >
                      <Box>
                          Department of Surgery 
                      </Box>
                      <Box>
                          Division of Oncologic & Endocrine Surgery
                      </Box>
                      <Box>
                          Medical University of South Carolina
                      </Box>
                      <Box>
                          Graph database software courtesy of Neo4J
                      </Box>
                      <Box>
                          Supported in part by Invitae/Medneon
                      </Box>
                  </Typography>
              </Box>
          </Box>
      </Paper>
    </>)
}
type MuscHeader2Props = {
    specialist: string
}

export const MuscHeader2 = ({specialist}:  MuscHeader2Props) => {

    const getDesc = () => {
        let result : string = ""
        switch (specialist) {
            case 'Generic':
                result = 'Cancer susceptibility gene visualizations using a Graph Database.'
                break;
            default: 
                result = `${specialist} Cancer susceptibility gene visualizations using a Graph Database.`

        }
        return result
    }

    return (<>
        <Typography 
            textAlign='center'
            variant='h3' 
            component='div'
            width='100%'
            color='primary.main'
        >
            {getDesc()}
        </Typography>
    </>)
}

export const MuscHeader3 = () => {

    const getDesc = () => {
        return 'Choose the speciality you are interested in.'
    }

    return (<>
        <Typography 
            textAlign='center'
            variant='h5' 
            component='div'
            width='100%'
            color='primary.main'
        >
            {getDesc()}
        </Typography>
    </>)
}

export const MuscFooter = () => {
    const getDesc = () => {
        return 'This website provides visualizations of cancer susceptibility genes and gene combinations'
    }
    return (<>
            <Typography 
                textAlign='center'
                component='div'
                variant='h3' 
                width='100%'
                color='primary.main'
            >
                {getDesc()}
            </Typography>
            <Typography
                id='ZZZZZ-parent' 
                component='div'
                textAlign='left'
                width='100%'
                paddingLeft={10}
                paddingRight={10}
                color='primary.main'
            >
                <Box>
                    Pathogenic variants inherited at birth (Germline) in certain genes increase the risk of certain cancers.
                </Box>
                <Box>
                        Cancer susceptibility genes can be better understood using a framework of 
                        <ul>
                            <li>spectrum of diseases caused</li>
                            <li>penetrance for each disease</li>
                            <li>the predominant subtype of each disease</li>
                            <li>age of onset</li>
                        </ul>
                        When managing a patient with a pathogenic variant in a given gene, the spectrum of disease suggests which diseases to address in our management plan and suggests what family history might be indicative of this gene.  The penetrance suggests how aggressive to be in management.  The age of onset tells us when to institute management.
                        In the past, syndromes have been defined that often predated the understanding of the underlying gene.  Syndromes can be useful to help us remember certain family characteristics of certain genes. 
                </Box> 
            </Typography>
      </>)
    }

export const MuscLoading = () => {
    const getDesc = () => {
        return 'Builing Graph...'
    }
    return (<>
            <Typography 
                textAlign='center'
                component='div'
                variant='h3' 
                width='100%'
                color='primary.main'
            >
                {getDesc()}
            </Typography>
      </>)
    }
type MuscSpecialistNotFoundProps = {
    specialist: string | undefined

}

export const MuscSpecialistNotFound = ({ specialist} : MuscSpecialistNotFoundProps)  => {
    const getDesc = () => {
        return `Specialist not found! ${specialist}`
    }
    return (<>
            <Typography 
                textAlign='center'
                component='div'
                variant='h3' 
                width='100%'
                color='primary.main'
            >
                {getDesc()}
            </Typography>
      </>)
    }