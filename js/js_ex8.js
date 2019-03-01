var len = 5;
var player = 2;
var card_mark_list = {0:"s", 1:"h",2:"d",3:"c"};//中身の数値は画像データに合わせる
var card_num_list = {0:"02", 1:"03", 2:"04", 3:"05",
                     4:"06", 5:"07", 6:"08", 7:"09",
                     8:"10", 9:"11", 10:"12", 11:"13",
                     12:"01"};//インデックスは弱い順にし、中身の数値は画像データ名に合わせる

// 手札の三次元配列用
var card_list = [];
//ハイカード入れ
var high_card = [];
//勝敗カウント
var win_count = 0;
var lose_count = 0;
var draw_count = 0; //確認用

//役判定テスト用
var a1 = [1,1];
var a2 = [1,2];
var a3 = [1,3];
var a4 = [1,4];
var a5 = [2,9];
var a6 = [2,5];
var a7 = [2,2];
var a8 = [2,3];
var a9 = [2,4];
var a10 = [1,8];
var b1 = [a1,a2,a3,a4,a5];
var b2 = [a6,a7,a8,a9,a10];
var c = [b1,b2];
// console.log("c[1][1]",c[1]);


//要素入れ
var card_P = [];
var card_C = [];
var card_id = [];
var hand_P;
var hand_C;
var hand_id = [];
var result_id = [];

//要素の取得
for(var i=0; i<len; i++){
  p_id = "cardP" + (i+1) + "_id";
  card_P.push(document.getElementById(p_id));
  c_id = "cardC" + (i+1) + "_id";
  card_C.push(document.getElementById(c_id));
}
// console.log("card_P",card_P);
// console.log("card_C",card_C);
card_id.push(card_P,card_C);
// console.log("card_id",card_id);

var button = document.getElementById("button_id");
hand_id.push( document.getElementById("handP_id") );
hand_id.push( document.getElementById("handC_id") );
result_id.push( document.getElementById("result_p_id") );
result_id.push( document.getElementById("result_c_id") );
var total_win_id = document.getElementById("total_win_id");
var total_lose_id = document.getElementById("total_lose_id");
// console.log("hand_id",hand_id);

var ikasama_id = document.getElementById("ikasama_id");
var ikasama_err_tx = document.getElementById("ikasama_err_id");
var p_icon = document.getElementById("p_icon_id");
var ikasama_rate;
var ikasama_flag = 0;
var ikasama_timing = 0;
var button_counts = 0; //buttonが押されるごとにカウント
ikasama_id.addEventListener("blur", function(){

  //ikasamaの入力と入力確認
  ikasama_rate = ikasama_id.value;
  console.log("ikasama_rate",ikasama_rate);
  if (ikasama_rate.match(/^[0-9]*$/)) {
    if (ikasama_rate.match(/^[0]{1}/)) {
      button.disabled = true; //ボタンを押せない
      ikasama_err_tx.innerHTML = "※先頭が０";
    }
    else {
      // console.log("else");
      button.disabled = false; //ボタン解除
      ikasama_err_tx.innerHTML = "";
    }
  }
  else {
    button.disabled = true; //ボタンを押せない
    ikasama_err_tx.innerHTML = "※半角数字で入力";
  }

}, false);

//ボタンクリック
button.addEventListener("click", function(){

  //ikasama入力を削除したとき用の初期化
  if (ikasama_id.value === "") {
    console.log("空文字だ");
    ikasama_timing = "空文字だよ";
  }

  if (ikasama_timing === 0) {
    //ikasamaのタイミングを入力値を最大に乱数で決定
    ikasama_timing = Math.floor( Math.random() * ikasama_rate+1 );
    console.log("ikasama_timing:",ikasama_timing);
  }

  button_counts++;
  console.log("button_counts:",button_counts);

  if (button_counts === ikasama_timing) {
    ikasama_flag = 1;
    console.log("ikasama_flag:",ikasama_flag);
    button_counts = 0;  //button_countsの初期化
    // console.log("button_counts:",button_counts);
    ikasama_timing = 0; //ikasama_flagの初期化
    // console.log("ikasama_timing:",ikasama_timing);
    p_icon.innerHTML = "<img src='images/devil.png' width='56px' height='56px'>"
  }
  else {
    ikasama_flag = 0;
    p_icon.innerHTML = "<img src='images/hakase.jpg' width='56px' height='56px'>"
  }

  card_list = [];
  // 手札作成
  make_card_list(card_list);

  var result_hand = []
  for (var i = 0; i < card_list.length; i++) {
    result_hand.push( hand_decision(card_list[i],i) );
  }
  // result_hand.push( hand_decision(b1) );
  // result_hand.push( hand_decision(b2) );
  // console.log("result_hand:",result_hand);

  hand_and_game_result(card_list,result_hand,ikasama_flag);
  // hand_and_game_result(c,result_hand,1);

  // hand_decision(b1);
  // hand_decision(b2);

  // card_distribute(card_list,card_id);

  }, false);

function make_card_list(card_list){
  // console.log("card_list初期化",card_list);
  var card_list_one = [];//片方のプレイヤーのカードリスト
  var card = [];

  for (var i=0; i < player; i++) {
    card_list_one = [,,,,,];
    for(var u=0; u<len; u++){
      var diff_flag = 1;
      while (diff_flag === 1) {
        card = [];
        var rand_mark = Math.floor( Math.random() * 4 );
        var rand_num = Math.floor( Math.random() * 13 );
        card = [rand_mark,rand_num];
        diff_flag = diff_card_check(card,card_list_one,card_list);
        // console.log("diff_flag",diff_flag);
        // console.log("u",u,"card",card,"card_list_one",card_list_one);
        }
        card_list_one[u] = card;
      }

    card_list[i] = card_list_one;
  }
  // console.log("card_list",card_list);
  //配布
  // card_distribute(card_list,card_id);
}


function diff_card_check(card,list_one,card_list){

  for(var i=0; i<len; i++){
    for(var u=0; u<len; u++){
      if(card_list[i] !== undefined){
        if(card.toString() === card_list[i][u].toString()){
          // console.log("相手とダブった");
          // console.log("card",card,"card_list["+i+"]",card_list[i]);
          return 1;
        }
      }
      else if(list_one[u] === undefined){
        break;
      }
      else if(i!==u && card.toString() === list_one[u].toString()){
        // console.log("ダブった");
          return 1;
      }
    }
  }
  return 0;

}


function hand_decision(card_list_one,z){
  // console.log("z",z);

  //役判定フラグ
  var flash = 0;        //フラッシュ
  var straight = 0;     //ストレート
  var pair_max = 0;     //ペアの最大枚数
  var pair_count = 0;   //ペアの数
  var num_sum = 0;      //手札の数字の合計値

  var counts_mark = {};   //マークのダブりカウント
  var counts_num = {};    //数字のダブりカウント
  var card_num_list = []; //数字のみ配列


  for (var i = 0; i < len; i++) { //上記をすべてここで
    var key_mark = card_list_one[i][0];
    counts_mark[key_mark] = (counts_mark[key_mark])? counts_mark[key_mark] + 1 : 1 ;
    var key_num = card_list_one[i][1];
    counts_num[key_num] = (counts_num[key_num])? counts_num[key_num] + 1 : 1 ;
    card_num_list.push( card_list_one[i][1] );
    num_sum += card_list_one[i][1];
  }
  //手札の数字の最小最大値
  var num_min = Math.min.apply(null,card_num_list);
  var num_max = Math.max.apply(null,card_num_list);
  console.log("counts_mark",counts_mark,"counts_num",counts_num);
  // console.log("key_num:",key_num);
  // console.log("num_list",card_num_list);
  // console.log("min:",num_min,"max:",num_max);

  //ペアの数とペア枚数の最大
  var counts_num_key =Object.keys(counts_num); //手札の数字のキー
  // console.log("counts_num_key:",counts_num_key);
  for (var i = 0; i < counts_num_key.length; i++) {
    var u = counts_num_key[i];
    // console.log("counts_num["+i+"]:",counts_num[u],">pair_max:",pair_max);
    // console.log("counts_num["+i+"]",counts_num);
      if (counts_num[u] > 1) {
        pair_count++;
      }
    if (counts_num[u] > pair_max) {
      pair_max = counts_num[u];
    }
  }
  // console.log("pair_count",pair_count);
  // console.log("pair_max",pair_max);

//フラッシュ判別
  for (var i = 0; i < 4; i++) {
    if(counts_mark[i] === 5){
      flash = 1;
    }
  }
  // console.log("flash",flash);

//ストレート判別
  if (pair_count === 0) {//数字にダブりがないとき
    //等差数列の公式
    var ap_formula = len * ( num_min*2 + (len-1)*1 ) / 2;
    // console.log("ap_formula:",ap_formula);
    // console.log("num_sum:",num_sum);
    if (ap_formula === num_sum) {
      straight = 1;
    }
  }
  // console.log("straight:",straight);


  var return_hand = [];
//役判定
  //ロイヤルストレートフラッシュ
  if (straight === 1 && flash ===1 && num_sum === 50) {//10～Aまで足し合わせると50
    return_hand = [9,"ロイヤルストレートフラッシュ"];
    return return_hand;
  }
  //ストレートフラッシュ
  else if (straight === 1 && flash ===1) {
    return_hand = [8,"ストレートフラッシュ"];
    return return_hand;
  }
  //フォーカード
  else if (pair_max === 4) {
    return_hand = [7,"フォーカード"];
    return return_hand;
  }
  //フルハウス
  else if (pair_max === 3 && pair_count === 2) {
    return_hand = [6,"フルハウス"];
    return return_hand;
  }
  //フラッシュ
  else if (flash === 1) {
    return_hand = [5,"フラッシュ"];
    return return_hand;
  }
  //ストレート
  else if (straight === 1) {
    return_hand = [4,"ストレート"];
    return return_hand;
  }
  //スリーオブアカインド
  else if (pair_max === 3) {
    return_hand = [3,"スリーオブアカインド"];
    return return_hand;
  }
  //ツーペア
  else if (pair_count === 2) {
    return_hand = [2,"ツーペア"];
    return return_hand;
  }
  //ワンペア
  else if (pair_count === 1) {
    return_hand = [1,"ワンペア"];
    return return_hand;
  }
  //ハイカード
  else {
    high_card[z] = num_max;
    // console.log("high_card:["+z+"]",high_card[z]);
    return_hand = [0,"役なし"];
    return return_hand;
  }

}

function hand_and_game_result(card_list,hand,ikasama){


//勝敗結果判定
  var hand_p = hand[0][0];
  var hand_c = hand[1][0];
  // console.log("hand_p",hand_p,"hand_c",hand_c);
  var result = [];
  if (hand_p === hand_c) {
    // console.log("Draw判定");
    // console.log("high_card[0]",high_card[0],"high_card[1]",high_card[1]);
    if (ikasama === 1) {
      console.log("ikasamaドロー");
      // 手札再作成(ボタンクリック時と同じ処理)
      card_list = [];
      make_card_list(card_list);
      result_hand = []
      for (var y = 0; y < card_list.length; y++) {
        result_hand.push( hand_decision(card_list[y],y) );
      }
      hand_and_game_result(card_list,result_hand,ikasama_flag);
    }
    else {
      if (hand_p === 0) { //ハイカードのとき
        if (high_card[0] === high_card[1]) { //ハイカードも同数の時
          result = ["Draw","Draw"];
        }
        else {
          // console.log("high_card[0]",high_card[0],"high_card[1]",high_card[1]);
          result = high_card[0] > high_card[1] ? ["Win‼","Lose..."] : ["Lose","Win‼"];
        }
      }
      else {
        result = ["Draw","Draw"];
      }
    }
  }
  else {
    if (ikasama === 1) {
      if (hand_p < hand_c) {

        console.log("ikasamaチェンジ！");
        //カードリストを入れ替え
        var swap_list = card_list[0].slice();
        card_list[0] = card_list[1].slice();
        card_list[1] = swap_list.slice();
        //役を入れ替え
        var swap_hand = hand[0].slice();
        hand[0] = hand[1].slice();
        hand[1] = swap_hand.slice();
        //結果を親勝利に
        result = ["Win‼","Lose..."];
        //Draw判定でまわってきたとき用フラグ初期化
        ikasama_flag = 0;
      }
      else {
        result = hand_p > hand_c ? ["Win‼","Lose..."] : ["Lose","Win‼"];
      }
    }
    else {
      result = hand_p > hand_c ? ["Win‼","Lose..."] : ["Lose","Win‼"];
    }
  }

//カード配布  （旧）function card_distribute()
  for(var i=0; i<player; i++){
    for(var u=0; u<len; u++){

      var card_mark = card_list[i][u][0];
      var mark = card_mark_list[ card_mark ];

      var card_num = card_list[i][u][1];
      var num = card_num_list[ card_num ];

      card_id[i][u].innerHTML =  "<img src=images/trump/gif/" + mark + num + ".gif width='52px' height='80px'>";
    }
  }


//勝敗・役出力
  for (var i = 0; i < result.length; i++) {

    result_id[i].innerHTML = result[i];
    hand_id[i].innerHTML = hand[i][1];

    //通算勝敗数
    if (i === 1) {
      if (result[i] === "Win‼") {
        win_count++;
      }
      else if (result[i] === "Lose...") {
        lose_count++;
      }
      else {
        draw_count++;
      }
    }
    console.log("win:",win_count);
    console.log("lose:",lose_count);
    console.log("draw:",draw_count);
    total_win_id.innerHTML = win_count;
    total_lose_id.innerHTML = lose_count;
  }

}
