<?php
/**
 * Battery Endurance Calculator.
 */

if ( ! defined( 'ABSPATH' ) ) exit; // Don't allow direct access

$voltage = $_GET['input'] ? $_GET['input'] : "11.1 V";
$capacity = $_GET['input'] ? $_GET['input'] : "5000 mAh";

?>

<div class="well calculator">
    <div class="calc-link">
        <a href="" id="link-a">Link to these results <i class="fa fa-link" aria-hidden="true"></i></a>
    </div>
    <form onsubmit="return false;">
        <div class="form-group has-feedback" id="voltageInputGroup">
	        <label for="voltageInput"><h4>Nominal Voltage of Battery</h4></label>
            <div style="position:relative">
	            <input type="text" class="form-control" id="voltageInput" placeholder="11.1 V" onkeyup="runCalcs()" aria-describedby="inputSuccess2Status" value="<?php echo $voltage; ?>" />
	            <span class="fa fa-2x fa-check form-control-feedback" id="voltageInputIcon" aria-hidden="true"></span>
            </div>
            <span id="inputSuccess2Status" class="sr-only">(success)</span>
            <span id="helpBlock" class="help-block">Enter voltage followed by unit. (e.g. "11.1 V")</span>
        </div>
        <div class="form-group has-feedback" id="capacityInputGroup">
	        <label for="capacityInput"><h4>Capacity of Battery</h4></label>
            <div style="position:relative">
	            <input type="text" class="form-control" id="capacityInput" placeholder="5000 mAh"onkeyup="runCalcs()" aria-describedby="inputSuccess2Status" value="<?php echo $capacity; ?>" />
	            <span class="fa fa-2x fa-check form-control-feedback" id="capacityInputIcon" aria-hidden="true"></span>
            </div>
            <span id="inputSuccess2Status" class="sr-only">(success)</span>
            <span id="helpBlock" class="help-block">Enter capacity followed by unit. (e.g. "5000 mAh" or "10 Ah")</span>
        </div>
    </form>
    <br />
    <div class="row">
	    <div class="col-sm-6">
		    <table class="table table-hover table-condensed">
			    <tr>
				    <th>Battery Energy</th>
			    </tr>
			    <tbody id="energyTableContent"></tbody>
		    </table>
	    </div>
    </div>
    <div id="chartEndurance" style="width: 100%;"></div>		
    <div id="chartT100" style="width: 100%;"></div>
    <div id="chartT200" style="width: 100%;"></div>				
</div>
