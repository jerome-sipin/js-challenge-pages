// IMPORTANT 
// Reminder: You cannot load local .json through html file. It has to be on 
// a server for some reason. Go to console, cd to hw folder,
// type "$ python -m http.server", then go to http://localhost:8000/
// to load the .json file

// Everything runs within the json function so that all functions have 
// access to the data within samples.json
d3.json("samples.json").then(function(data){
    console.log(data);
    dataset = data;
    samples = dataset.samples;
    console.log(samples)

    // Get initial dataset for the bar chart from the first ID in the list, so ID = "940"
    var initSampleValues = Object.values(samples[0].sample_values);
    var initOtuID = Object.values(samples[0].otu_ids);
    var initLabels = Object.values(samples[0].otu_labels);
    let initOtuID2 = initOtuID.map(function(id){
        return `OTU ${id}`
    })

    // Get initial metadata
    var metadata = dataset.metadata;
    var initID = metadata[0].id;
    var initE = metadata[0].ethnicity;
    var initG = metadata[0].gender;
    var initA = metadata[0].age;
    var initL = metadata[0].location;
    var initB = metadata[0].bbtype;
    var initW = metadata[0].wfreq;

    // Assign inital metadata to page
    d3.select("#id").text(`id: ${initID}`)
    d3.select('#ethnicity').text(`ethnicity: ${initE}`)
    d3.select('#gender').text(`gender: ${initG}`)
    d3.select('#age').text(`age: ${initA}`)
    d3.select('#location').text(`location: ${initL}`)
    d3.select('#bbtype').text(`bbtype: ${initB}`)
    d3.select('#wfreq').text(`wfreq: ${initW}`)

    // Assign initial dataset as default data to all charts
    function init(){
        ////////////////////////////
        /// H-Bar Plot Section ////
        ///////////////////////////

        // Sort sample values, then use index to sort the
        // id column
        initSamp10 = initSampleValues.sort(function(a,b){
            return b - a;
        })

        initOtuID10 = initOtuID2.sort(function(a,b){
            return initSamp10.indexOf(a) - initSamp10.indexOf(b);
        })
        initLabels2 = initLabels.sort(function(a,b){
            return initSamp10.indexOf(a) - initSamp10.indexOf(b)
        })

        // Slice arrays to use only first 10 values.

        initSamp10 = initSampleValues.slice(0,10);
        initOtuID10 = initOtuID2.slice(0,10);

        var initBarData = [{
            x: initSamp10,
            y: initOtuID10,
            text: initLabels2,
            type: "bar",
            orientation: 'h',
        }];

        var layout = {
            height: 600,
            width: 600,
        };

        // Plot horizontal bar
        Plotly.newPlot("bar", initBarData, layout);

        ////////////////////////////
        /// Bubble Chart Section //
        ///////////////////////////

        // Use initial data in bubble chart
        var trace1 = {
            x: initSampleValues,
            y: initOtuID,
            text: initLabels,
            mode: 'markers',
            marker: {
                color: initOtuID,
                size: initSampleValues
            }
          };
          
          var data = [trace1];
          
          var layout = {
            title: 'OTU IDs',
            showlegend: false,
            height: 600,
            width: 1200
          };
          
        // Plot bubble chart
          Plotly.newPlot('bubble', data, layout);
    }

    // Listen to change on dropdown menu, execute the function getData on list change
    d3.selectAll("#selDataset").on("change", getData);

    // Define getData, which updates all plots and metadata section when change is detected in the dropdown 
    function getData(){

        // On change of dropdown menu, get the 'value' (index) of the selected element
        var dropdownMenu = d3.select("#selDataset");
        var dataset = dropdownMenu.property("value");

        ///////////////////////////
        //// Metadata Section ////
        //////////////////////////
        // Get new metadata array and assign to new variables
        var newM = metadata[dataset];
        var newID = newM.id;
        var newE = newM.ethnicity;
        var newG = newM.gender;
        var newA = newM.age;
        var newL = newM.location;
        var newB = newM.bbtype;
        var newW = newM.wfreq;
    
        // Assign new metadata to page
        d3.select("#id").text(`id: ${newID}`);
        d3.select('#ethnicity').text(`ethnicity: ${newE}`);
        d3.select('#gender').text(`gender: ${newG}`);
        d3.select('#age').text(`age: ${newA}`);
        d3.select('#location').text(`location: ${newL}`);
        d3.select('#bbtype').text(`bbtype: ${newB}`);
        d3.select('#wfreq').text(`wfreq: ${newW}`);
    

        ///////////////////////////
        ////// Plots Section /////
        //////////////////////////
        // Find entry in sample that matches the value (index) entered by the user
        var newSample = samples[dataset];

        // Next few lines are re-use of initial code, but with different variable names
        var SampleValues = Object.values(newSample.sample_values);
        var OtuID = Object.values(newSample.otu_ids);
        let OtuID2 = OtuID.map(function(id){
            return `OTU ${id}`
        })
        var newLabels = Object.values(newSample.otu_labels)

        // Sort sample values, then use index to sort the
        // id and label arrays
        Samp10 = SampleValues.sort(function(a,b){
            return b - a;
        })
        OtuID10 = OtuID2.sort(function(a,b){
            return Samp10.indexOf(a) - Samp10.indexOf(b);
        })
        sLabels = newLabels.sort(function(a,b){
            return Samp10.indexOf(a) - Samp10.indexOf(b)
        })

        // Slice arrays to use only first 10 values.
        Samp10 = SampleValues.slice(0,10);
        OtuID10 = OtuID2.slice(0,10);

        // Define new arrays for the new data, then use .restyle to apply new data on the page
        x = Samp10;
        y = OtuID10;
        labelText = sLabels;

        // Restyle bar using sorted arrays
        Plotly.restyle("bar", "x", [x])
        Plotly.restyle("bar", "y", [y])
        Plotly.restyle("bar", "text", [sLabels])

        // Restyle bubble using un-sorted arrays
        Plotly.restyle("bubble", "x", [SampleValues])
        Plotly.restyle("bubble", "y", [OtuID])
        Plotly.restyle("bubble", "text", [newLabels])
    }

    // Execute initalization function
    init();
})