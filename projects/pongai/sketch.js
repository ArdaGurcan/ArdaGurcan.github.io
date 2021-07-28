let population;
let lifespan = 200;
let time = 0;
let totalFitness = 0;
let generation = 0;
let ballPos;
let ballVel;
let lpPos;
let genDone = false;
let speed = 10
let fittest=0;
let player = false;
let playerLost = false;
function setup() {
    createCanvas(800, 600);
    population = new Population();
    ballPos = createVector(width/2, height/2)
    ballVel = createVector(-2,2)
    lpPos = createVector(20, ballPos.y)
    $.get('', function(data) {
        population.paddles[0].dna.genes = JSON.parse(data)
     }, 'text');

    // population.paddles[0].dna.genes=JSON.parse("[148.6291479910683,154.14763134858256,386.9672873205803,419.38042751595185,168.11038706056348,10.442828576011642,222.88191371678033,439.1018356115435,493.37253326108976,235.8888589080671,11.777395960203885,206.8565092988338,465.3085265184622,440.91811172775755,124.87618245309362,46.40151935519976,261.57055370522176,448.2382217705099,415.2042092814435,184.52688668961625,7.713781544600007,313.6859758729651,469.05775816455997,321.33644544703645,125.36812308647815,91.70238912847883,312.7593879781517,497.9109132983465,288.4627834905166,96.12139230891981,93.75311748171467,364.7818123964219,481.5480402412137,261.65335107232556,30.905394968577692,100.6825466817175,354.07563694820277,492.29034660035234,255.74676965063182,42.04293169985773,96.47768563603198,395.2101428838364,476.36443582726986,244.41482966926498,4.3596492858134495,149.088037038292,412.83575380042214,371.684969191997,190.10497775621093,3.7569922752092033,216.58689118097186,452.9569467721158,372.5059507934986,148.7267641326261,38.644008649211024,229.0415863172386,467.26476867941966,302.5750364033385,157.98289450079773,17.48345861761047,337.14851516001164,470.47391998898945,264.1950506367202,47.61704424538071,56.343768393704366,279.05839586368376,494.3977853039001,337.01180650495843,80.05829325042824,120.89271783302713,329.94483363863844,490.91359561355375,205.68252982826672,49.95351124593572,167.82634627382097,335.0396100329288,417.11723147262245,269.67854214254663,15.397807671642894,132.16741076724892,401.64408344858515,424.41089992927385,143.4167245222726,8.233681269618764,203.68085802522518,474.98585472804547,377.47231521830304,149.55550090787062,2.357515713594882,177.58513617818815,458.45011357784927,412.24885805593084,104.52096724750093,25.381380659388554,272.3641496899224,456.64989359590516,346.5720282232052,138.90116094326277,35.074168724040454,332.22520280327495,495.83240154659256,312.63259313914926,95.263387319099,124.34182676843952,277.055591975892,496.15312621076293,239.7933709182808,74.42686773265162,130.80842004641102,397.7517183051281,472.7113483087453,184.7807409309754,50.80465754137431,186.85246556829992,438.7704440353247,494.06720790612144,253.58102412947636,26.287909556665934,196.3729046539805,382.17244537671445,456.21206208496244,331.95582120852373,23.432510815627914,385.15605945778594,443.9966784844789,163.0040083745905,9.18368729359942,276.3071569488098,388.3115237359522,59.572299280725275,487.1100860678593,77.49460644396544,424.78209913521647,5.68520934848904,28.361429708807727,314.1066238157294,125.84483209602892,419.42579811679303,360.7468713051769,439.3586849314559,237.7385576189578,368.62612654623797,214.18164127418015,85.38669222799366,373.8389596046841,355.08698996056864,107.88173917389332,311.83571306712366,122.88716959294632,157.59330660852677,475.10228238722897,236.29086349299178,115.50025283313714,340.67105821081225,383.7808559620177,289.4507046151763,410.5065172496308,356.0904823956084,30.803169059965274,213.331331656762,21.78498587089017,286.48239111069387,314.76433403640294,458.96106061441253,24.673657366380276,75.88134718338169,243.94597639686054,311.24369925686193,306.8689998769618,197.12075001345653,436.9471758319413,453.97188216687465,322.8926999823901,256.4099315688916,328.4565541412069,257.6666270757936,156.3027193200578,37.54942138384987,49.35117682536239,301.54857414318724,414.05533932315666,267.85598354957716,191.9636262048523,285.0416588170585,314.9805262188957,338.43354087995823,337.2745888021276,10.673881653377236,97.16019602536564,59.57127602032486,29.77252751641657,65.58657813991664,108.59794011137069,116.0580621556555,289.0500200588062,355.08126703715413,175.55478210957455,441.54197309294875,421.43454686949144,315.9523951063334]")
    // JSON.stringify(population.paddles.fittest.dna.genes)

}

function draw() {
    for (let i = 0; i < speed; i++) 
    {
        if(player)
        {
            if(keyIsDown(SHIFT))
            {
                player = false
            }

            if(keyIsDown(UP_ARROW)){
                lpPos.y-=3
            }
            if(keyIsDown(DOWN_ARROW)){
                lpPos.y+=3
            }
            if(ballPos.x < 50)
            {

                if((ballPos.y+10 > lpPos.y && ballPos.y-10 < lpPos.y+100))
                {
                    ballVel= createVector(-ballVel.x,ballVel.y)
                    time++;
                }
                else
                {
                playerLost = true;
                }
            }
        }
        else
        {
            if(keyIsDown(RETURN))
            {
                player = true}
            lpPos = createVector(lpPos.x, ballPos.y-50)
            if(ballPos.x > width -10 || ballPos.x < 0 + 50)
            {
                ballVel= createVector(-ballVel.x,ballVel.y)
                time++;
            }
        }
    
    
    ballPos = ballPos.add(ballVel)
    
    if(ballPos.y > height -10 || ballPos.y < 0 + 10)
    {
        ballVel = createVector(ballVel.x,-ballVel.y)

    }
    if(ballPos.x +10 > width-40)
    {
        // console.log(ballPos.y)
        genDone = true;
        for (let i = 0; i < population.paddles.length; i++) {
            // console.log(population.paddles[i].position)
            if(!population.paddles[i].failed && ballPos.y+10 > population.paddles[i].position && ballPos.y-10 < population.paddles[i].position+100)
            {
                // console.log(time)
                ballVel.x = -2
                population.paddles[i].score+=1
                genDone = false
            }
            else
            {
                population.paddles[i].failed = true
            }
            
        }
        
    }
    background(50);
    noStroke();
    text(time, width/2, 50)
    fill(255, 150);
    rect(ballPos.x-10, ballPos.y-10, 20, 20)
    rect(lpPos.x, lpPos.y, 20, 100)

    totalFitness = 0;
    population.run();
    
    // console.log(Math.floor((time/(2*(width-80)/2))))

    if (time >= lifespan || genDone ||playerLost) {
        playerLost = false
        ballPos = createVector(width/2, height/2)
        ballVel = createVector(-2,2)
        population.evaluate();
        population.selection();
        time = 0;
        generation++;
        console.log(
            "Average Fitness: " +
                totalFitness / populationSize 
        );
        console.log("Max Fitness: " + population.recordFitness)
        fittest = population.recordFitness
        console.log("Population Size: " + populationSize);
        console.log("Generation: " + generation);
        console.log("Life Span: " + lifespan);
        console.log("Mutation Chance: " + mutationRate * 100 + "%");
        genDone = false
        
        $.post( "save.php", { gene: JSON.stringify(population.paddles[0].dna.genes)} );
    }
}
}