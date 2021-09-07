import {createCustomElement, actionTypes} from '@servicenow/ui-core';
const {COMPONENT_BOOTSTRAPPED} = actionTypes;
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import { createHttpEffect } from '@servicenow/ui-effect-http';
import styles from './styles.scss';

const view = (state, {updateState}) => {
	// const { u_monitored_lane = 'Loading number', u_ln_num = 'Loading short description'} = state;
	const {headerItems, columnItems} = state;
	
	return (
		<div>
			{/* <p>{u_monitored_lane} : {u_ln_num} </p> */}
			<table border="1">
				<tr>
					{headerItems}
				</tr>
				<tr>
					{columnItems}
				</tr>
			</table>
		</div>
	);
};

createCustomElement('ats-mld-lookup-r2', {
	actionHandlers: {
		[COMPONENT_BOOTSTRAPPED]: (coeffects) => {
			const { dispatch } = coeffects;
		
			dispatch('FETCH_LATEST_INCIDENT', {
				sysparm_query: 'u_parent=000233ca1b73d0905a8e2fc4bd4bcb7b',
				//sysparm_query: 'ORDERBYDESCu_ln_num',
				sysparm_fields: 'u_ln_num,u_lane_select,u_monitored_lane',
				sysparm_display_value: 'true'
			});
		},
		'FETCH_LATEST_INCIDENT': createHttpEffect('api/now/table/u_cmdb_ci_master_lane_designation_lanes', {
			method: 'GET',
			queryParams: ['sysparm_query', 'sysparm_fields', 'sysparm_display_value' ],
			headers: {
				"X-UserToken": "window.g_ck"
			},
			successActionType: 'FETCH_LATEST_INCIDENT_SUCCESS',
		}),
		'FETCH_LATEST_INCIDENT_SUCCESS': (coeffects) => {
			const { action, updateState } = coeffects;
			// const  {laneData}  = action.payload.result[0].u_monitored_lane;
			const { result } = action.payload;
			const  {u_lane_select, u_ln_num, u_monitored_lane}  = result;
			const headerItems = result.map((result) =>
				<th>{result.u_ln_num}</th>
			);
			const columnItems = result.map((result) =>
				<td>{result.u_lane_select} - {result.u_monitored_lane}</td>
			);
			// console.log(result[0].u_monitored_lane)
			// updateState({u_lane_select, u_ln_num, u_monitored_lane});
			updateState({headerItems, columnItems})
		}
	},
	renderer: {type: snabbdom},
	view,
	styles,
});