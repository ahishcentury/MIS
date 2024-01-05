import { DatePicker, Space } from "antd";
import moment from "moment";
const { RangePicker } = DatePicker;

export default function DateRangeTimePicker(props) {
  const { filterValues, state, setState } = props;

  const onRangeChange = (dates, dateStrings) => {
    if (dates) {
      setState(dates);
      filterValues.current.startDate = moment
        .utc(dateStrings[0], "DD/MM/YYYY hh:mm:ss")
        .utcOffset(4)
        .toISOString();
      filterValues.current.endDate = moment
        .utc(dateStrings[1], "DD/MM/YYYY hh:mm:ss")
        .utcOffset(4)
        .toISOString();
    } else {
      console.log("Clear");
    }
  };

  return (
    <RangePicker
      size="large"
      value={state}
      format="DD/MM/YYYY"
      onChange={onRangeChange}
    />
  );
}
