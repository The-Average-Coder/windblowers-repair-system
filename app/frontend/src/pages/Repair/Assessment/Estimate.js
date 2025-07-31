import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';

import { base64WindblowersLogo } from './base64WindblowersLogo';

const styles = StyleSheet.create({
    page: { padding: '30px' },
    logo: { width: '160px', margin: '-10px' },
    title: { position: 'absolute', top: '30px', right: '30px', fontSize: '18px', fontWeight: 'bold' },
    heading: { fontWeight: 'bold' },
    italic: { fontStyle: 'italic' },

    address: { marginTop: '24px', fontSize: '11px' },
    customer: { marginTop: '24px', fontSize: '11px' },

    estimate: { marginTop: '24px', fontSize: '11px' },

    assessedWork: { marginTop: '24px' },
    itemisedCosts: { marginTop: '12px' },

    estimateTableColumn: { display: 'flex', flexDirection: 'row', marginTop: '4px' },
    estimateTotalColumn: { fontSize: '13px', display: 'flex', flexDirection: 'row', marginTop: '4px', fontWeight: 'bold' },

    columnTitle: { flex: '3' },
    columnContents: { flex: '7' },
    columnContent: { display: 'flex', flexDirection: 'row', marginBottom: '2px' },
    columnContentValue: { flex: '5' },
    columnContentCost: { flex: '2' },

    endnotes: { marginTop: '24px', fontSize: '9px' },
})

const Estimate = ({ assessment, customer, materials }) => (
    <Document>
        <Page size='A4' style={styles.page}>
            <Image src={base64WindblowersLogo} style={styles.logo} />
            <Text style={styles.title}>ESTIMATE</Text>

            <View style={styles.address}>
                <Text>29 Technology Drive</Text>
                <Text>Beeston</Text>
                <Text>NG9 1LA</Text>
            </View>

            <View style={styles.customer}>
                <Text style={styles.heading}>Customer</Text>
                <Text>{customer.firstname} {customer.surname}</Text>
                {customer.email && <Text>{customer.email}</Text>}
                {customer.telephone && <Text>{customer.telephone}</Text>}
            </View>

            <View style={styles.estimate}>
                <Text><Text style={styles.heading}>Estimate Date:</Text> {assessment.date_created}</Text>

                <View style={styles.assessedWork}>

                    <Text style={styles.heading}>Assessed Work</Text>

                    <Text>{assessment.notes}</Text>
                
                </View>

                <View style={styles.itemisedCosts}>

                    <Text style={styles.heading}>Itemised Costs</Text>

                    <View style={styles.estimateTableColumn}>
                        <Text style={styles.columnTitle}>Labour</Text>
                        <Text style={styles.columnContentValue}>{Math.floor(assessment.time / 60)} Hours {assessment.time % 60} Minutes</Text>
                        <Text style={styles.columnContentCost}>£{assessment.time_cost.toFixed(2)}</Text>
                    </View>

                    {assessment.materials.length > 0 &&
                    <View style={styles.estimateTableColumn}>
                        <Text style={styles.columnTitle}>Materials</Text>

                        <View style={styles.columnContents}>
                            {assessment.materials.map(material => {
                                if (material.id === 0) return;

                                return <View style={styles.columnContent}>
                                    <Text style={styles.columnContentValue}>{materials.find(otherMaterial => otherMaterial.id === parseInt(material.id)) ? materials.find(otherMaterial => otherMaterial.id === parseInt(material.id)).name : 'Deleted Material'} x{material.quantity}</Text>
                                    <Text style={styles.columnContentCost}>£{parseFloat(material.cost).toFixed(2)}</Text>
                                </View>
                            })}

                            {assessment.materials.find(material => material.id === 0) &&
                            <View style={styles.columnContent}>
                                    <Text style={styles.columnContentValue}>Misc Materials</Text>
                                    <Text style={styles.columnContentCost}>£{parseFloat(assessment.materials.find(material => material.id === 0).cost).toFixed(2)}</Text>
                            </View>
                            }
                        </View>
                    </View>
                    }

                    <View style={styles.estimateTotalColumn}>
                        <Text style={styles.columnTitle}>Total</Text>
                        <Text style={styles.columnContentValue}></Text>
                        <Text style={styles.columnContentCost}>£{parseFloat(assessment.time_cost + assessment.materials.reduce((partialSum, a) => partialSum + parseFloat(a.cost), 0)).toFixed(2)}</Text>
                    </View>
                
                </View>

            </View>

            <View style={styles.endnotes}>
                <Text style={styles.italic}>Final cost may vary by 5% due to variance in materials.</Text>
                <Text style={styles.italic}>Any queries contact sales@windblowers.co.uk</Text>
            </View>
        </Page>
    </Document>
);

export default Estimate;