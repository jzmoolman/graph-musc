import { useState, useRef, } from 'react'

import { Button, Dropdown, DropdownProps } from 'semantic-ui-react'

import { ColorScheme, defualtColorScheme } from './genGraph'
import { GeneSelector, GeneDataType } from './GeneSelector'
import { GeneOrganGraph } from './GeneOrganGraph'
import { OrganSelector, OrganDataType } from './OrganSelector'
import { OrganGeneGraph } from './OrganGeneGraph'
import { SyndromeDataType, SyndromeSelector } from './SyndromeSelector'
import { SyndromeGeneGraph } from './SyndromeGeneGraph'
import { SyndromeGraph } from './SyndromeGraph'
import './Graph.css'
 

type DataType = {
    nodes: []
    links: []
}


export const Graph = () => {

    const [selectedGraph, setSelectedGraph] = useState('gene-organ')
    const [selectedGenes, setSelectedGenes] = useState<GeneDataType[]>([])
    const [selectedOrgans, setSelectedOrgans] = useState<OrganDataType[]>([])
    const [selectedSyndromes, setSelectedSyndromes] = useState<SyndromeDataType[]>([])
    const [selectedGender, setSelectedGender] = useState('Both')
    const [selectedVerified, setSelectedverified] = useState(true)
    const [colorScheme, setColorScheme] = useState<ColorScheme>(defualtColorScheme)

    const refgeneNodeColor =  useRef(null)
    const refgeneFontColor = useRef(null)

    const onChangeGenes = (genes: GeneDataType[]) => {
        console.log('onChangeGenes', genes)
        setSelectedGenes(genes)
    }

    const onChangeOrgan = (organs: OrganDataType[]) => {
        console.log('onChangeOrgan', organs)
        setSelectedOrgans(organs)
    }
    
    const onChangeSyndrome = (syndromes: SyndromeDataType[]) => {
        console.log('onChangeSydrome', syndromes)
        setSelectedSyndromes(syndromes)
    }
   
    const onChangeVerified = (verified: boolean) => {
        console.log('onChangeVerified', verified)
        setSelectedverified(verified)
    }

    const onChangeGeneNodeColor = (color: string) => {
        console.log('onChangeGeneNodeColor', color)
    }
 
    console.log(window.innerWidth || 1000)

    

    return ( 
        <div className='graph_container'>
            <div className='graph_menu'>
                <div className='graph_menu_item'>
                    Graph
                    <span  style={{display:'inline-block', width:'5px'}}/>
                    <Dropdown placeholder='Select graph' 
                        options={[ 
                            {text:'Gene -> Organ', value:'gene-organ'},
                            {text:'Organ <- Gene', value:'organ-gene'},
                            {text:'Syndrome -> Organ <- Gene', value:'syndrome'},
                            {text:'Syndrome -> Gene', value:'syndrome-gene'}]}
                        defaultValue='gene-organ'
                        onChange={(e,data) => {
                            if (data.value != selectedGraph ) {
                               console.log(data)
                               setSelectedGraph(data.value as string)
                            }
                        }
                    }/>
                </div>
                <div className='graph_menu_item'>
                    Genes
                    <span  style={{display:'inline-block', width:'5px'}}/>
                    <GeneSelector onChange={onChangeGenes}/>
                </div>
                <div className='graph_menu_item'>
                    Organ
                    <span  style={{display:'inline-block', width:'5px'}}/>
                    <OrganSelector onChange={onChangeOrgan}/>
                </div>
                <div className='graph_menu_item'>
                    Syndrome
                    <span  style={{display:'inline-block', width:'5px'}}/>
                    <SyndromeSelector onChange={onChangeSyndrome}/>
                </div>
                <div className='graph_menu_item'>
                    Gender
                    <span  style={{display:'inline-block', width:'5px'}}/>
                    <Dropdown placeholder='Select gender' options={[{text:'Both',value:'Both'},{text:'Male',value:'Male'},{text:'Female',value:'Female'}]} 

                        onChange={(e,data) => {
                            console.log(data)
                            //setSelectedGender(data.value.)
                        }} 
                    />
                </div>
                <div className='graph_menu_item'>
                    Invitea verified
                    <span  style={{display:'inline-block', width:'5px'}}/>
                    <Dropdown placeholder='Invitae verified' 
                        options={[{text:'Yes',value:true},{text:'No',value:false}]} 
                        defaultValue={selectedVerified}
                        onChange={(e,data) => {
                            onChangeVerified(data.value as boolean)
                        }}
                    />
                </div>
                <div>
                    Configuration
                </div>
                <div className='graph_menu_item'> 
                    Gene node color
                    <span  style={{display:'inline-block', width:'5px'}}/>
                    <Dropdown 
                        ref={refgeneNodeColor}
                        placeholder='Select color' 
                        options={[ 
                            {text:'Red', value:'red'},
                            // {text:'Oragne', value:'oragne'},
                            {text:'Yellow', value:'yellow'},
                            {text:'Olive', value:'olive'},
                            {text:'Green', value:'green'},
                            {text:'Teal', value:'teal'},
                            {text:'Blue', value:'blue'},
                            {text:'Violet', value:'violet'},
                            {text:'Purple', value:'purple'},
                            {text:'Pink', value:'pink'},
                            {text:'Brown', value:'brown'},
                            {text:'Grey', value:'grey'},
                            {text:'Black', value:'black'},
                            {text:'White', value:'white'},
                        ]}
                        defaultValue={'blue'} 
                        onChange={(e,data) => {
                            setColorScheme({...colorScheme,geneNodeColor: data.value as string})
                        }}
                    />
                </div>
                <div className='graph_menu_item'> 
                    Gene font color
                    <span  style={{display:'inline-block', width:'5px'}}/>
                    <Dropdown 
                        ref={refgeneFontColor}
                        placeholder='Select color' 
                        options={[ 
                            {text:'Red', value:'red'},
                            // {text:'Oragne', value:'oragne'},
                            {text:'Yellow', value:'yellow'},
                            {text:'Olive', value:'olive'},
                            {text:'Green', value:'green'},
                            {text:'Teal', value:'teal'},
                            {text:'Blue', value:'blue'},
                            {text:'Violet', value:'violet'},
                            {text:'Purple', value:'purple'},
                            {text:'Pink', value:'pink'},
                            {text:'Brown', value:'brown'},
                            {text:'Grey', value:'grey'},
                            {text:'Black', value:'black'},
                            {text:'White', value:'white'},
                        ]}
                        defaultValue={'white'} 
                        onChange={(e,data) => {
                            setColorScheme({...colorScheme,geneFontColor: data.value as string})
                        }}
                    />
                </div>
                <div className='graph_menu_item'>
                    Organ node color
                    <span  style={{display:'inline-block', width:'5px'}}/>
                    <Dropdown placeholder='Select color' 
                        options={[ 
                            {text:'Red', value:'red'},
                            {text:'Oragne', value:'oragne'},
                            {text:'Yellow', value:'yellow'},
                            {text:'Olive', value:'olive'},
                            {text:'Green', value:'green'},
                            {text:'Teal', value:'teal'},
                            {text:'Blue', value:'blue'},
                            {text:'Violet', value:'violet'},
                            {text:'Purple', value:'purple'},
                            {text:'Pink', value:'pink'},
                            {text:'Brown', value:'brown'},
                            {text:'Grey', value:'grey'},
                            {text:'Black', value:'black'},
                            {text:'White', value:'white'},
                        ]}
                        defaultValue={'red'} 
                        onChange={(e,data) => {
                            setColorScheme({...colorScheme,organNodeColor: data.value as string})
                        }}
                    />
                </div>
                <div className='graph_menu_item'>
                    Organ font color
                    <span  style={{display:'inline-block', width:'5px'}}/>
                    <Dropdown placeholder='Select color' 
                        options={[ 
                            {text:'Red', value:'red'},
                            {text:'Oragne', value:'oragne'},
                            {text:'Yellow', value:'yellow'},
                            {text:'Olive', value:'olive'},
                            {text:'Green', value:'green'},
                            {text:'Teal', value:'teal'},
                            {text:'Blue', value:'blue'},
                            {text:'Violet', value:'violet'},
                            {text:'Purple', value:'purple'},
                            {text:'Pink', value:'pink'},
                            {text:'Brown', value:'brown'},
                            {text:'Grey', value:'grey'},
                            {text:'Black', value:'black'},
                            {text:'White', value:'white'},
                        ]}
                        defaultValue={'white'} 
                        onChange={(e,data) => {
                            setColorScheme({...colorScheme,organFontColor: data.value as string})
                        }}
                    />
                </div>
                <div className='graph_menu_item'>
                    Syndrome node color
                    <span  style={{display:'inline-block', width:'5px'}}/>
                    <Dropdown placeholder='Select color' 
                        options={[ 
                            {text:'Red', value:'red'},
                            // {text:'Orange', value:'orange'},
                            {text:'Yellow', value:'yellow'},
                            {text:'Olive', value:'olive'},
                            {text:'Green', value:'green'},
                            {text:'Teal', value:'teal'},
                            {text:'Blue', value:'blue'},
                            {text:'Violet', value:'violet'},
                            {text:'Purple', value:'purple'},
                            {text:'Pink', value:'pink'},
                            {text:'Brown', value:'brown'},
                            {text:'Grey', value:'grey'},
                            {text:'Black', value:'black'},
                            {text:'White', value:'white'},
                        ]}
                        defaultValue={'yellow'} 
                        onChange={(e,data) => {
                            setColorScheme({...colorScheme,syndromeNodeColor: data.value as string})
                        }}
                    />
                </div>
                <div className='graph_menu_item'>
                    Syndrome font color
                    <span  style={{display:'inline-block', width:'5px'}}/>
                    <Dropdown placeholder='Select color' 
                        options={[ 
                            {text:'Red', value:'red'},
                            // {text:'Orange', value:'orange'},
                            {text:'Yellow', value:'yellow'},
                            {text:'Olive', value:'olive'},
                            {text:'Green', value:'green'},
                            {text:'Teal', value:'teal'},
                            {text:'Blue', value:'blue'},
                            {text:'Violet', value:'violet'},
                            {text:'Purple', value:'purple'},
                            {text:'Pink', value:'pink'},
                            {text:'Brown', value:'brown'},
                            {text:'Grey', value:'grey'},
                            {text:'Black', value:'black'},
                            {text:'White', value:'white'},
                        ]}
                        defaultValue={'black'} 
                        onChange={(e,data) => {
                            setColorScheme({...colorScheme,syndromeFontColor: data.value as string})
                        }}
                    />
                </div>
                <div style={{textAlign:'right'}}>
                    <Button>Default</Button>
                    <Button 
                        onClick={ () => {
                            console.log(refgeneNodeColor)
                            console.log(refgeneFontColor)


                        }}
                    >Apply</Button>

                </div>
            </div>

            <div className='graph'> 
                {selectedGraph == 'gene-organ'? 
                    <GeneOrganGraph selectedGenes={selectedGenes} verified={selectedVerified}/>: <></>
                }
                {selectedGraph == 'organ-gene'? 
                    <OrganGeneGraph selectedOrgans={selectedOrgans} verified={selectedVerified}/>: <></>
                }
                {selectedGraph == 'syndrome-gene'? 
                    <SyndromeGeneGraph 
                        selectedSyndromes={selectedSyndromes} 
                        verified={selectedVerified}
                        colorScheme={colorScheme}
                    />: <></>
                }
                {selectedGraph == 'syndrome'? 
                    <SyndromeGraph 
                        selectedSyndromes={selectedSyndromes} 
                        verified={selectedVerified}
                    />: <></>
                }
            </div>
        </div>
        
    )

}
