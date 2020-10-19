import { Card, CardContent, Typography } from '@material-ui/core'
import React from 'react'
import './InfoBox.css'

function InfoBox({title, cases, active, isRed, isOrange, isGreen, total, ...props}) {
    return (
        <Card 
        onClick={props.onClick}
        className={`infoBox ${active && "infoBox--selected"} ${isRed && "infobox--red"} ${isGreen && "infobox--green"} ${isOrange && "infobox--orange"} `}>
            <CardContent>
                {/* Title */}
                <Typography className="infoBox_title" color ="textSecondary">
                    {title}
                </Typography>                
                
                {/* Number of Cases

                Total */}
                <h2 className= {`infoBox_cases ${isGreen && "infoBox_cases--green"} ${isOrange && "infobox_cases--orange"} `} > {cases} </h2>
                <Typography className="infoBox_total" color ="textSecondary">
                    {total} Total
                </Typography>
            </CardContent>
            
        </Card>
    )

}

export default InfoBox 
