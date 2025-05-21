let view
let dict = {}

export default {
    ChangeScore_Single: (score, game_mode)=>{
        if(window.rankgame == false)
            return

        let dom = dict["play"]
        let rank_scores = dom.getElementsByClassName("rank-score-style")

        let index_ = null
        // console.log(game_mode)
        switch (game_mode) {
            case "constant":
                index_ = 0
                break;

            case "liberty":
                index_ = 1
                break;

            case "draft":
                index_ = 2
                break;
        }

        // console.log(rank_scores)
        // console.log(index_)
        let current_score = parseInt(rank_scores[index_].innerText)
        let ret = current_score
        current_score += score
        if(score > 0 || (score < 0 && current_score >= 100))
            rank_scores[index_].innerText = current_score

        return ret

    },
    ChangeScore: (scores)=>{
        let dom = dict["play"]
        let rank_scores = dom.getElementsByClassName("rank-score-style")
        rank_scores[0].innerText = scores["constant"]
        rank_scores[1].innerText = scores["liberty"]
        rank_scores[2].innerText = scores["draft"]
    },
    SavePage: (key, dom) => { dict[`${key}`] = dom },
    LoadPage: (key) => { return dict[`${key}`] },
    InitialView: (view_) => { view = view_ },
    ConvertView: (key) => {
        // console.log(key);
        let dom = dict[`${key}`];
        // console.log(dom)
        while (view.hasChildNodes())
            view.removeChild(view.firstChild);

        view.appendChild(dom)
    }

}





