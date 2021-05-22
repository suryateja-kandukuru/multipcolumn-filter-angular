import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output
} from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-table-filter',
  templateUrl: './table-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./table-filter.component.css'],
})
export class TableFilterComponent implements OnInit, OnChanges {
  // Inputs
  @Input() filterType!: any;
  @Input() filterApplied!: Boolean;
  @Input() tableData: any[] = [];
  @Input() filterColumn: any = '';
  @Input() filterObj: any;
  @Input() rows: any;

  // Ouputs
  @Output() filterOuputData: EventEmitter<any> = new EventEmitter();
  @Output() filterObjEmit: EventEmitter<any> = new EventEmitter();

  // member variables
  public dropdown = new FormControl();
  public dropDownArray: any[] = [];
  public dropDownFilterArray: any[] = [];
  public dropDownFil: any[] = [];
  public filteredDataApply: any[] = [];
  public firstOptionChecked: boolean = false;
  public input_value = '';
  public dateTypes: string[ ]  = ['Date Range', 'Date is', 'Date After', 'Date Before', 'Date Not']
  public selectedDateType = ''
  public singleDateSelected: any = ''
  public minDateSelected: any = ''
  public maxDateSelected: any = ''
  public dropdownFilterCheck: boolean = false
  // constructor
  constructor() {}

  ngOnInit() {}

  ngOnChanges() {
    this.filteredDataApply = [...this.rows];
    // if filter type is dropdown the modifying the json to suitable way like having value and checked status
    if (this.filterType === 'dropdown') {
      this.dropDownArray = this.rows.map((x: any) => {
        if (x[this.filterColumn]) {
          return x[this.filterColumn];
        }
      });
      // to remove the duplicate values from the dropdownArray using the set() method and again converting them to array
      this.dropDownArray = Array.from(new Set(this.dropDownArray));
      this.dropDownFilterArray = this.dropDownArray.map((x: any) => {
        return {
          value: x,
          checked: false,
        };
      });
      this.dropDownFil = this.dropDownFilterArray
    }
    // setting the back the old values if the same menu opened again
    if (this.filterColumn === this.filterObj[this.filterColumn].key) {
      switch (this.filterObj[this.filterColumn].filterType) {
        case 'input':
          this.assignInputValue(
            this.filterObj[this.filterColumn].filteredValue
          );
          break;
        case 'dropdown':
          this.assignDropdownValues(
            this.filterObj[this.filterColumn].filteredValue
          );
          break;
        case 'date': this.assignDateValues(this.filterObj[this.filterColumn].filteredValue)
        break;
      }
    }
  }

  /**
   * Event triggers when ever change in the input text filter
   * @param event 
   */
  change(event: any) {
    const filterValue = event.target.value.toLowerCase();
    // const data =  this.rows.filter((x:any) => (x[this.filterColumn]).toLowerCase().includes(filterValue))
    this.filterObj[this.filterColumn].filteredValue = filterValue;
    this.filterObjEmit.emit(this.filterObj);
    // this.filterOuputData.emit(data)
  }

  /**
   * Filter the dropdown filter list with input as text provided
   * @param event 
   */
  filterDropdown(event: any) {
    const filterValue = event.target.value.toLowerCase();
    const filterArr: any[] = this.dropDownArray.filter((x: any) =>
     x.toLowerCase().includes(filterValue)
    )
    this.dropDownFil = this.dropDownFilterArray.filter((x: any) => {
      const index = filterArr.indexOf(x.value)
      return (x.value === filterArr[index])
    })
    // this.filterObjEmit.emit(this.filterObj);
  }

 
  /**
   * selection for dropdown filter
   * @param e 
   */
  onSelectionChange(e: any) {
    const col = this.filterColumn;
    const selected = e.option.selected; // checked status
    const option = e.option.value; // option value selected
    if (option === undefined && !option) {
      if (selected) {
        this.filterObj[col].filteredValue = [ ]
        this.dropDownFilterArray.forEach((x: any) => {
        this.filterObj[col].filteredValue.push({
          value: x.value,
          checked: true,
        });
        return x.checked = true
      })
      } else {
        this.filterObj[col].filteredValue = [ ]
      }
    }
    if (option) {
      if (selected) {
        this.filterObj[col].filteredValue.push({
          value: option.value,
          checked: true,
        });
      } else {
        const index = this.filterObj[col].filteredValue.findIndex(
          (obj: any) => obj.value === option.value
        );
        this.filterObj[col].filteredValue.splice(index, 1);
      }
    }
    this.filterObjEmit.emit(this.filterObj);


    // const data = this.filterObj[col].filteredValue.map((x: any) => x.value);
    // this.tableData = this.rows.filter((x: any) => data.includes(x[col]));
  }


  setAll(state: any) {
    this.checkAllSelected(state)
    this.filterObjEmit.emit(this.filterObj);
  }


  checkAllSelected(selected: any) {
    const col = this.filterColumn
    if (selected) {
      this.filterObj[col].filteredValue = [ ]
      this.dropDownFilterArray.forEach((x: any) => {
      this.filterObj[col].filteredValue.push({
        value: x.value,
        checked: true,
      });
      return x.checked = true
    })
    } else {
      this.filterObj[col].filteredValue = [ ]
    }
  }

  /**
   * Applies filter on click of apply filter
   */
  applyFilter() {
    const obj = Object.keys(this.filterObj);
    const len = obj.length;
    for (let i = 0; i < len; i++) {
      const prop: any = this.filterObj[obj[i]];
      switch (prop['filterType']) {
        case 'input':
          this.applyInputFilter(prop.key, this.filterObj[obj[i]].filteredValue);
          break;
        case 'dropdown':
          this.applyDropdownFilter(
            prop.key,
            this.filterObj[obj[i]].filteredValue
          );
          break;
        case 'date':
          this.applyDateFilter(prop.key, this.filterObj[obj[i]].filteredValue);
          break;
        default:
          break;
      }
    }
    this.filterOuputData.emit(this.filteredDataApply);
  }

  /**
   * set back the previous value if u open the same filter menu again
   * - for Input filter value
   * @param value 
   */
  assignInputValue(value: any) {
    this.input_value = value;
  }

  /**
   * set back the previous value if u open the same filter menu again
   * - for dropdown filter value
   * @param arr 
   */
  assignDropdownValues(arr: any) {
    const data = this.filterObj[this.filterColumn].filteredValue
    if (data.length) {
      const stat = data.every((x: any) => x.checked)
      this.firstOptionChecked = !!(stat)
    } else {
      this.firstOptionChecked = false
    }
    this.dropDownFilterArray.forEach((x: any) => {
      arr.forEach((y: any) => {
        if (x.value === y.value) {
          x.checked = y.checked;
        }
      });
    });
  }

  /**
   * set back the previous value if u open the same filter menu again
   * - for date filter value
   * @param data 
   */
  assignDateValues(data: any) {
    if (this.selectedDateType === 'Date Range') {
      this.minDateSelected = data.rangeFilterType.min
      this.maxDateSelected = data.rangeFilterType.max
    } else {
      this.singleDateSelected = data.singleFilterType.value
    }
  }

  /**
   * A sub method of applyFilter() to filter input text fields
   * @param prop 
   * @param filterValue 
   */
  applyInputFilter(prop: any, filterValue: any) {
    if (filterValue) {
      const data = this.filteredDataApply.filter((x: any) =>
        x[prop].toLowerCase().includes(filterValue)
      );
      this.filterObj[prop].filteredValue = filterValue;
      this.filteredDataApply = [...data];
    }
  }
  
  /**
   * A sub method of applyFilter() to filter dropdowns
   * @param prop 
   * @param arr 
   */
  applyDropdownFilter(prop: any, arr: any) {
    if (arr.length) {
      const col = prop;
      const data = arr.map((x: any) => x.value);
      this.filteredDataApply = this.filteredDataApply.filter((x: any) =>
        data.includes(x[col])
      );
    }
  }
  


  // Date Related Methods

  /**
   * choosing the option type whether range date selection or single date selection
   * @param event 
   */
  onDateSelection(event: any) {
    this.selectedDateType = event.value
  }

  /**
   * single date selection and saves the date into filterObj of particular column
   * @param event 
   */
  onSingleDateSelected(event: any) {
    const date =  new Date(event.value)
    this.filterObj[this.filterColumn].filteredValue.singleFilterType = { value: date, dataFilterType: this.selectedDateType }
    this.filterObj[this.filterColumn].filteredValue.rangeFilterType = { min: '', max: '' }
  }

  /**
   * Range date -  min date selection
   * @param event 
   */
  onStartRangeDateSelected(event: any) {
    const date =  new Date(event.value)
    this.filterObj[this.filterColumn].filteredValue.rangeFilterType.min = date
    this.filterObj[this.filterColumn].filteredValue.singleFilterType = { value: '', dataFilterType: '' }
  }

  /**
   * Range date -  max date selection
   * @param event
   */
  onEndRangeDateSelected(event: any) {
    const date =  new Date(event.value)
    this.filterObj[this.filterColumn].filteredValue.rangeFilterType.max = date
    this.filterObj[this.filterColumn].filteredValue.singleFilterType = { value: '', dataFilterType: '' }
  }

  /**
   * Applying date filter based on two types
   * 1. SingleFilter - options like  >, < , === , !=
   * 2. RangeFilter - between
   * @param prop 
   * @param data 
   */
  applyDateFilter(prop: any, data: any) {
    if (data.singleFilterType.value != '') {
      switch(data.singleFilterType.dataFilterType) { 
        case 'Date is':
        this.filteredDataApply = this.filteredDataApply.filter((x: any) => {
          const date1 = new Date(x[prop]).toISOString()
          const date2 = new Date(data.singleFilterType.value).toISOString()
          return date1 === date2
         })
        break;
        case 'Date After':
        this.filteredDataApply = this.filteredDataApply.filter((x: any) => {
          const date1 = new Date(x[prop])
          const date2 = new Date(data.singleFilterType.value)
          return date1 > date2
         })
        break;
        case 'Date Before': this.filteredDataApply = this.filteredDataApply.filter((x: any) => {
          const date1 = new Date(x[prop])
          const date2 = new Date(data.singleFilterType.value)
          return date1 < date2
         })
        break;
        case 'Date Not': this.filteredDataApply = this.filteredDataApply.filter((x: any) => {
          const date1 = new Date(x[prop]).toISOString()
          const date2 = new Date(data.singleFilterType.value).toISOString()
          return date1 != date2
         })
        break;
      }
    } else if((data.rangeFilterType.max != '') && (data.rangeFilterType.min != '')) {
      this.filteredDataApply = this.filteredDataApply.filter((x: any) => {
        const startDate = new Date(data.rangeFilterType.min)
        const endDate = new Date(data.rangeFilterType.max)
        const date = new Date(x[prop])
        return ((date >= startDate) && (date <= endDate))
       })
    }
  }

  // clear filters

  /**
   * clears the column filter applied
   */
  clearColumn() {
    const col = this.filterColumn
    const filterType = this.filterObj[col].filterType
    switch(filterType) {
      case 'input': this.filterObj[col].filteredValue = '';
      break;
      case 'dropdown': this.filterObj[col].filteredValue = [];
      break;
      case 'date': this.clearDateFilter(col)
      break;
      default: this.filterObj[col].filteredValue = '';
    }
    this.applyFilter()
  }

  /**
   * clears the date filter applied which is used in clearColumn() method
   * @param col 
   * @returns 
   */
  clearDateFilter(col: any) {
    this.selectedDateType = ''
    this.singleDateSelected = ''
    this.minDateSelected = ''
    this.maxDateSelected = ''
    this.filterObj[col].filteredValue.rangeFilterType = { min: '', max: '' };
    this.filterObj[col].filteredValue.singleFilterType = { value: '', dataFilterType: '' }
    return
  }

}
