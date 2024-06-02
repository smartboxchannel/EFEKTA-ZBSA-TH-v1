const fz = require('zigbee-herdsman-converters/converters/fromZigbee');
const tz = require('zigbee-herdsman-converters/converters/toZigbee');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const reporting = require('zigbee-herdsman-converters/lib/reporting');
const e = exposes.presets;
const ea = exposes.access;

const tzLocal = {
    node_config: {
        key: ['reading_interval', 'config_report_enable', 'comparison_previous_data', 'poll_rate_on'],
        convertSet: async (entity, key, rawValue, meta) => {
            const lookup = {'OFF': 0x00, 'ON': 0x01};
            const value = lookup.hasOwnProperty(rawValue) ? lookup[rawValue] : parseInt(rawValue, 10);
            const payloads = {
                reading_interval: ['genPowerCfg', {0x0201: {value, type: 0x21}}],
				config_report_enable: ['genPowerCfg', {0x0275: {value, type: 0x10}}],
				comparison_previous_data: ['genPowerCfg', {0x0205: {value, type: 0x10}}],
				poll_rate_on: ['genPowerCfg', {0x0216: {value, type: 0x10}}],
            };
            await entity.write(payloads[key][0], payloads[key][1]);
            return {
                state: {[key]: rawValue},
            };
        },
    },
	termostat_config: {
        key: ['high_temp', 'low_temp', 'enable_temp', 'invert_logic_temp'],
        convertSet: async (entity, key, rawValue, meta) => {
            const lookup = {'OFF': 0x00, 'ON': 0x01};
            const value = lookup.hasOwnProperty(rawValue) ? lookup[rawValue] : parseInt(rawValue, 10);
            const payloads = {
                high_temp: ['msTemperatureMeasurement', {0x0221: {value, type: 0x29}}],
                low_temp: ['msTemperatureMeasurement', {0x0222: {value, type: 0x29}}],
				enable_temp: ['msTemperatureMeasurement', {0x0220: {value, type: 0x10}}],
				invert_logic_temp: ['msTemperatureMeasurement', {0x0225: {value, type: 0x10}}],
            };
            await entity.write(payloads[key][0], payloads[key][1]);
            return {
                state: {[key]: rawValue},
            };
        },
    },
	hydrostat_config: {
        key: ['high_hum', 'low_hum', 'enable_hum', 'invert_logic_hum'],
        convertSet: async (entity, key, rawValue, meta) => {
            const lookup = {'OFF': 0x00, 'ON': 0x01};
            const value = lookup.hasOwnProperty(rawValue) ? lookup[rawValue] : parseInt(rawValue, 10);
            const payloads = {
                high_hum: ['msRelativeHumidity', {0x0221: {value, type: 0x21}}],
                low_hum: ['msRelativeHumidity', {0x0222: {value, type: 0x21}}],
				enable_hum: ['msRelativeHumidity', {0x0220: {value, type: 0x10}}],
				invert_logic_hum: ['msRelativeHumidity', {0x0225: {value, type: 0x10}}],
            };
            await entity.write(payloads[key][0], payloads[key][1]);
            return {
                state: {[key]: rawValue},
            };
        },
    },
		temperaturef_config: {
        key: ['temperature_offset'],
        convertSet: async (entity, key, rawValue, meta) => {
            const value = parseFloat(rawValue)*10;
            const payloads = {
                temperature_offset: ['msTemperatureMeasurement', {0x0210: {value, type: 0x29}}],
            };
            await entity.write(payloads[key][0], payloads[key][1]);
            return {
                state: {[key]: rawValue},
            };
        },
    },
	humidityf_config: {
        key: ['humidity_offset'],
        convertSet: async (entity, key, rawValue, meta) => {
            const value = parseFloat(rawValue)*10;
            const payloads = {
                humidity_offset: ['msRelativeHumidity', {0x0210: {value, type: 0x29}}],
            };
            await entity.write(payloads[key][0], payloads[key][1]);
            return {
                state: {[key]: rawValue},
            };
        },
    },
};

const fzLocal = {
    node_config: {
        cluster: 'genPowerCfg',
        type: ['attributeReport', 'readResponse'],
        convert: (model, msg, publish, options, meta) => {
            const result = {};
            if (msg.data.hasOwnProperty(0x0201)) {
                result.reading_interval = msg.data[0x0201];
            }
			if (msg.data.hasOwnProperty(0x0275)) {
				result.config_report_enable = ['OFF', 'ON'][msg.data[0x0275]];
            }
			if (msg.data.hasOwnProperty(0x0205)) {
				result.comparison_previous_data = ['OFF', 'ON'][msg.data[0x0205]];
            }
			if (msg.data.hasOwnProperty(0x0216)) {
                result.poll_rate_on = ['OFF', 'ON'][msg.data[0x0216]];
            }
            return result;
        },
    },
	termostat_config: {
        cluster: 'msTemperatureMeasurement',
        type: ['attributeReport', 'readResponse'],
        convert: (model, msg, publish, options, meta) => {
            const result = {};
            if (msg.data.hasOwnProperty(0x0221)) {
                result.high_temp = msg.data[0x0221];
            }
			if (msg.data.hasOwnProperty(0x0222)) {
                result.low_temp = msg.data[0x0222];
            }
            if (msg.data.hasOwnProperty(0x0220)) {
                result.enable_temp = ['OFF', 'ON'][msg.data[0x0220]];
            }
			if (msg.data.hasOwnProperty(0x0225)) {
                result.invert_logic_temp = ['OFF', 'ON'][msg.data[0x0225]];
            }
            return result;
        },
    },
	hydrostat_config: {
        cluster: 'msRelativeHumidity',
        type: ['attributeReport', 'readResponse'],
        convert: (model, msg, publish, options, meta) => {
            const result = {};
            if (msg.data.hasOwnProperty(0x0221)) {
                result.high_hum = msg.data[0x0221];
            }
			if (msg.data.hasOwnProperty(0x0222)) {
                result.low_hum = msg.data[0x0222];
            }
            if (msg.data.hasOwnProperty(0x0220)) {
                result.enable_hum = ['OFF', 'ON'][msg.data[0x0220]];
            }
			if (msg.data.hasOwnProperty(0x0225)) {
                result.invert_logic_hum = ['OFF', 'ON'][msg.data[0x0225]];
            }
            return result;
        },
    },
	temperaturef_config: {
        cluster: 'msTemperatureMeasurement',
        type: ['attributeReport', 'readResponse'],
        convert: (model, msg, publish, options, meta) => {
            const result = {};
            if (msg.data.hasOwnProperty(0x0210)) {
                result.temperature_offset = parseFloat(msg.data[0x0210])/10.0;
            }
            return result;
        },
    },
	humidityf_config: {
        cluster: 'msRelativeHumidity',
        type: ['attributeReport', 'readResponse'],
        convert: (model, msg, publish, options, meta) => {
            const result = {};
            if (msg.data.hasOwnProperty(0x0210)) {
                result.humidity_offset = parseFloat(msg.data[0x0210])/10.0;
            }
            return result;
        },
    },
};

const definition = {
        zigbeeModel: ['EFEKTA_ZBSA-TH_v1'],
        model: 'EFEKTA_ZBSA-TH_v1',
        vendor: 'EfektaLab',
        description: 'EFEKTA_ZBSA-TH_v1 - Smart temperature and humidity sensors.',
        fromZigbee: [fz.temperature, fz.humidity, fz.battery, fzLocal.termostat_config, fzLocal.hydrostat_config, fzLocal.node_config, fzLocal.temperaturef_config, fzLocal.humidityf_config],
        toZigbee: [tz.factory_reset, tzLocal.termostat_config, tzLocal.hydrostat_config, tzLocal.node_config, tzLocal.temperaturef_config, tzLocal.humidityf_config],
        configure: async (device, coordinatorEndpoint, logger) => {
            const endpointOne = device.getEndpoint(1);
            await reporting.bind(endpointOne, coordinatorEndpoint, ['genPowerCfg', 'msTemperatureMeasurement', 'msRelativeHumidity']);
			const overrides1 = {min: 1800, max: 43200, change: 1};
			const overrides2 = {min: 30, max: 1200, change: 15};
			const overrides3 = {min: 60, max: 2400, change: 50};
            await reporting.batteryVoltage(endpointOne, overrides1);
            await reporting.batteryPercentageRemaining(endpointOne, overrides1);
			await reporting.batteryAlarmState(endpointOne, overrides1);
            await reporting.temperature(endpointOne, overrides2);
            await reporting.humidity(endpointOne, overrides3);
        },
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAAA8AXHiAAABN2lDQ1BBZG9iZSBSR0IgKDE5OTgpAAAokZWPv0rDUBSHvxtFxaFWCOLgcCdRUGzVwYxJW4ogWKtDkq1JQ5ViEm6uf/oQjm4dXNx9AidHwUHxCXwDxamDQ4QMBYvf9J3fORzOAaNi152GUYbzWKt205Gu58vZF2aYAoBOmKV2q3UAECdxxBjf7wiA10277jTG+38yH6ZKAyNguxtlIYgK0L/SqQYxBMygn2oQD4CpTto1EE9AqZf7G1AKcv8ASsr1fBBfgNlzPR+MOcAMcl8BTB1da4Bakg7UWe9Uy6plWdLuJkEkjweZjs4zuR+HiUoT1dFRF8jvA2AxH2w3HblWtay99X/+PRHX82Vun0cIQCw9F1lBeKEuf1UYO5PrYsdwGQ7vYXpUZLs3cLcBC7dFtlqF8hY8Dn8AwMZP/fNTP8gAAAAJcEhZcwAACxMAAAsTAQCanBgAAA0xaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0MiA3OS4xNjA5MjQsIDIwMTcvMDcvMTMtMDE6MDY6MzkgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6MTU1OTNhMGMtNTcxNy0wODQ3LTg5NGUtOWEyZDBlYzg2ZjU4IiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQ0YjU5YzFkLWU1ZWUtNjE0MC04MGFjLTc3YWQzNjIwYmIwYyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJBOTJCM0ZFMjQ1OTAyNTg1QkIwMEZFNTRERDFCREYwNSIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMi0xMi0wNFQyMToyMzoxMCswMzowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjQtMDItMTBUMDA6MDc6MTMrMDM6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjQtMDItMTBUMDA6MDc6MTMrMDM6MDAiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiB0aWZmOkltYWdlV2lkdGg9IjU3MyIgdGlmZjpJbWFnZUxlbmd0aD0iMTI4MCIgdGlmZjpQaG90b21ldHJpY0ludGVycHJldGF0aW9uPSIyIiB0aWZmOk9yaWVudGF0aW9uPSIxIiB0aWZmOlNhbXBsZXNQZXJQaXhlbD0iMyIgdGlmZjpYUmVzb2x1dGlvbj0iNzIwMDAwLzEwMDAwIiB0aWZmOllSZXNvbHV0aW9uPSI3MjAwMDAvMTAwMDAiIHRpZmY6UmVzb2x1dGlvblVuaXQ9IjIiIGV4aWY6RXhpZlZlcnNpb249IjAyMjEiIGV4aWY6Q29sb3JTcGFjZT0iMSIgZXhpZjpQaXhlbFhEaW1lbnNpb249IjQ0NyIgZXhpZjpQaXhlbFlEaW1lbnNpb249IjQ1MiI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjNkMmQwNmFmLTE5YmItMDA0Ni1hNjVmLTg5YzYwZGE0YjdjOSIgc3RFdnQ6d2hlbj0iMjAyMi0xMi0wNFQyMTozMiswMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjb252ZXJ0ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImZyb20gaW1hZ2UvanBlZyB0byBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252ZXJ0ZWQgZnJvbSBpbWFnZS9qcGVnIHRvIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjE3YzMyY2ZhLWRkMWEtYWE0NC04MTk1LTU2ODJiYjIwMTQxMCIgc3RFdnQ6d2hlbj0iMjAyMi0xMi0wNFQyMTozMiswMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo4NTQ5ZjA1Ni1mZjgxLTA0NGUtYjA0NC0xYTg4YTE3MDcwMzQiIHN0RXZ0OndoZW49IjIwMjMtMDEtMTRUMjE6NTc6MzQrMDM6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252ZXJ0ZWQgZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MDE0OTE5YTQtMjk5ZS05MjRiLWE0YjUtMmYyMTNkYzZmNmI0IiBzdEV2dDp3aGVuPSIyMDIzLTAxLTE0VDIxOjU3OjM0KzAzOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjQ0YjU5YzFkLWU1ZWUtNjE0MC04MGFjLTc3YWQzNjIwYmIwYyIgc3RFdnQ6d2hlbj0iMjAyNC0wMi0xMFQwMDowNzoxMyswMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4NTQ5ZjA1Ni1mZjgxLTA0NGUtYjA0NC0xYTg4YTE3MDcwMzQiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpiZGQ4NWM2ZC1iNzVmLWE2NDMtYmI4MC02YjBmOWU2M2U5ZWMiIHN0UmVmOm9yaWdpbmFsRG9jdW1lbnRJRD0iQTkyQjNGRTI0NTkwMjU4NUJCMDBGRTU0REQxQkRGMDUiLz4gPHRpZmY6Qml0c1BlclNhbXBsZT4g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',
		exposes: [e.temperature(), e.humidity(), e.battery_low(), e.battery(), e.battery_voltage(),
		exposes.binary('poll_rate_on', ea.STATE_SET, 'ON', 'OFF').withDescription('Poll rate on off'),
		exposes.numeric('reading_interval', ea.STATE_SET).withUnit('Seconds').withDescription('Setting the sensor reading interval. Setting the time in seconds, by default 15 seconds')
                .withValueMin(10).withValueMax(360),
			exposes.binary('config_report_enable', ea.STATE_SET, 'ON', 'OFF').withDescription('Enable reporting based on reporting configuration'),
		    exposes.binary('comparison_previous_data', ea.STATE_SET, 'ON', 'OFF').withDescription('Enable сontrol of comparison with previous data'),
			exposes.numeric('temperature_offset', ea.STATE_SET).withUnit('°C').withValueStep(0.1).withDescription('Adjust temperature')
                .withValueMin(-50.0).withValueMax(50.0),
			exposes.numeric('humidity_offset', ea.STATE_SET).withUnit('%').withValueStep(0.1).withDescription('Adjust humidity')
                .withValueMin(-50.0).withValueMax(50.0),
		    exposes.binary('enable_temp', ea.STATE_SET, 'ON', 'OFF').withDescription('Enable Temperature Control'),
		    exposes.binary('invert_logic_temp', ea.STATE_SET, 'ON', 'OFF').withDescription('Invert Logic Temperature Control'),
            exposes.numeric('high_temp', ea.STATE_SET).withUnit('C').withDescription('Setting High Temperature Border')
                .withValueMin(-40).withValueMax(75),
            exposes.numeric('low_temp', ea.STATE_SET).withUnit('C').withDescription('Setting Low Temperature Border')
                .withValueMin(-40).withValueMax(75),				
		    exposes.binary('enable_hum', ea.STATE_SET, 'ON', 'OFF').withDescription('Enable Humidity Control'),
		    exposes.binary('invert_logic_hum', ea.STATE_SET, 'ON', 'OFF').withDescription('Invert Logoc Humidity Control'),
            exposes.numeric('high_hum', ea.STATE_SET).withUnit('C').withDescription('Setting High Humidity Border')
                .withValueMin(0).withValueMax(99),
            exposes.numeric('low_hum', ea.STATE_SET).withUnit('C').withDescription('Setting Low Humidity Border')
                .withValueMin(0).withValueMax(99)],
};

module.exports = definition;