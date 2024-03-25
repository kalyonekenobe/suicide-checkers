:- use_module(library(lists)).

look_ahead_on(4).

initial_board(board(Black, White)) :-
    White = [fig(man, 0, 0), fig(man, 0, 2), fig(man, 1, 1), fig(man, 2, 0), fig(man, 2, 2), fig(man, 3, 1),
             fig(man, 4, 0), fig(man, 4, 2), fig(man, 5, 1), fig(man, 6, 0), fig(man, 6, 2), fig(man, 7, 1)],
    Black = [fig(man, 0, 6), fig(man, 1, 7), fig(man, 1, 5), fig(man, 2, 6), fig(man, 3, 7), fig(man, 3, 5),
             fig(man, 4, 6), fig(man, 5, 7), fig(man, 5, 5), fig(man, 6, 6), fig(man, 7, 7), fig(man, 7, 5)].

evaluate_board(board(Black, White), Score) :-
    list_count(Black, fig(man, _, _), BlackMans),
    list_count(Black, fig(king, _, _), BlackKings),
    list_count(White, fig(man, _, _), WhiteMans),
    list_count(White, fig(king, _, _), WhiteKings),
    Score is (-WhiteMans + 2 * -WhiteKings + BlackMans + 2 * BlackKings).

list_member(List, Member)               :- member(Member, List).
list_append(List1, List2, Result)       :- append(List1, List2, Result).
list_delete_one(List, Element, NewList) :- select(Element, List, NewList).
list_length(List, Length)               :- length(List, Length).
list_absent(List, Element)              :- \+ (member(Element, List)).
list_subtract(List1, List2, Result)     :- subtract(List1, List2, Result).
list_last_element(List, Element)        :- last(List, Element).

list_count([], _, 0).
list_count([FirstElement | Tail], Element, Occurrences) :-
    FirstElement = Element,
    list_count(Tail, Element, Tmp),
    Occurrences is (Tmp + 1), !.
list_count([_ | Tail], Element, Occurrences) :- list_count(Tail, Element, Occurrences).

side(white).
side(black).
other_side(black, white).
other_side(white, black).

pos(X, Y) :-
    member(Y, [0, 1, 2, 3, 4, 5, 6, 7]), member(X, [0, 1, 2, 3, 4, 5, 6, 7]),
    ((X + Y) mod 2) =:= 0.

fig(man, X, Y)  :- pos(X, Y).
fig(king, X, Y) :- pos(X, Y).

diagonal_is_free(_, _, X, Y, X, Y) :- !.

diagonal_is_free(List1, List2, X1, Y1, X2, Y2) :-
    Dx is sign(X2 - X1), Dy is sign(Y2 - Y1),
    NextX is (X1 + Dx), NextY is (Y1 + Dy),
    list_absent(List1, fig(_, NextX, NextY)),
    list_absent(List2, fig(_, NextX, NextY)),
    diagonal_is_free(List1, List2, NextX, NextY, X2, Y2).

possible_move(white, fig(man, X1, Y1), fig(Type, X2, Y2)) :-
    Y2 is (Y1 + 1), Y2 =< 7,
    (X2 is X1 + 1 ; X2 is X1 - 1), X2 >= 0, X2 =< 7,
    ( (Y2 = 7, Type = king) ; (Y2 < 7, Type = man) ).

possible_move(black, fig(man, X1, Y1), fig(Type, X2, Y2)) :-
    Y2 is (Y1 - 1), Y2 >= 0,
    (X2 is X1 + 1 ; X2 is X1 - 1), X2 =< 7, X2 >= 0,
    ( (Y2 = 0, Type = king) ; (Y2 > 0, Type = man) ).

possible_move(_, fig(king, X1, Y1), fig(king, X2, Y2)) :-
    fig(king, X2, Y2), X2 >= 0, X2 =< 7, Y2 >= 0, Y2 =< 7,  
    X1 \= X2,  Y1 \= Y2,                            
    DiagDiff1 is (X1 - Y1), DiagDiff2 is (X2 - Y2),
    DiagSum1 is (X1 + Y1), DiagSum2 is (X2 + Y2),
    (DiagDiff1 = DiagDiff2 ; DiagSum1 = DiagSum2).

way_is_free(ListWithMove, ListWithoutMove, fig(man, _, _), fig(_, X2, Y2)) :-
    list_absent(ListWithMove,    fig(_, X2, Y2)),
    list_absent(ListWithoutMove, fig(_, X2, Y2)).

way_is_free(ListWithMove, ListWithoutMove, fig(king, X1, Y1), fig(king, X2, Y2)) :-
    diagonal_is_free(ListWithMove, ListWithoutMove, X1, Y1, X2, Y2).

move_figure(Side, ListWithMove, ListWithoutMove, NewListWithMove) :-
    list_delete_one(ListWithMove, StartingPosition, TmpListWithMove),
    possible_move(Side, StartingPosition, DestPosition),
    way_is_free(ListWithMove, ListWithoutMove, StartingPosition, DestPosition),
    list_append(TmpListWithMove, [DestPosition], NewListWithMove).

move_figure(black, board(Black, White), board(NewBlack, White)) :-
    move_figure(black, Black, White, NewBlack).

move_figure(white, board(Black, White), board(Black, NewWhite)) :-
    move_figure(white, White, Black, NewWhite).

diagonal_positions(pos(X, Y), _, _, []) :- (X < 0 ; X > 7 ; Y < 0 ; Y > 7), !.
diagonal_positions(pos(X, Y), Dx, Dy, [pos(X, Y) | Tail]) :-
    NextX is (X + Dx), NextY is (Y + Dy),
    diagonal_positions(pos(NextX, NextY), Dx, Dy, Tail).

possible_capture(Side, fig(man, X1, Y1), fig(_, X2, Y2), fig(Type, X3, Y3)) :-
    Dx is (X2 - X1), Dy is (Y2 - Y1),
    AbsDx is abs(Dx), AbsDy is abs(Dy),
    AbsDx = 1, AbsDy = 1,
    X3 is (X2 + Dx), Y3 is (Y2 + Dy),
    X3 >= 0, X3 =< 7, Y3 >= 0, Y3 =< 7,
    (
        ( Side = white, ((Y3 = 7, Type = king) ; (Y3 < 7, Type = man)) ) ;
        ( Side = black, ((Y3 = 0, Type = king) ; (Y3 > 0, Type = man)) )
    ).

possible_capture(_, fig(king, X1, Y1), fig(_, X2, Y2), fig(king, X3, Y3)) :-
    Sum1 is (X1 + Y1), Sum2 is (X2 + Y2),
    Dif1 is (X1 - Y1), Dif2 is (X2 - Y2),
    (Sum1 = Sum2 ; Dif1 = Dif2),
    Dx is sign(X2 - X1), Dy is sign(Y2 - Y1),
    NextX is (X2 + Dx), NextY is (Y2 + Dy),
    diagonal_positions(pos(NextX, NextY), Dx, Dy, AllowableDestPositions),
    list_member(AllowableDestPositions, pos(X3, Y3)).

way_for_capture_is_free(CapturingList, CapturedList, fig(man, _, _), fig(_, _, _), fig(_, X3, Y3)) :-
    list_absent(CapturingList, fig(_, X3, Y3)),
    list_absent(CapturedList,  fig(_, X3, Y3)).

way_for_capture_is_free(CapturingList, CapturedList, fig(king, X1, Y1), fig(_, X2, Y2), fig(_, X3, Y3)) :-
    Dx is sign(X2 - X1), Dy is sign(Y2 - Y1),
    PrevX is (X2 - Dx), PrevY is (Y2 - Dy),
    diagonal_is_free(CapturingList, CapturedList, X1, Y1, PrevX, PrevY),
    diagonal_is_free(CapturingList, CapturedList, X2, Y2, X3, Y3).

potential_intermediate_king_pos(Side, CapturingList, CapturedList, CapturedFiguresList, pos(X1, Y1), pos(X2, Y2), pos(X3, Y3)) :-
    list_member(CapturedList, fig(_, X2, Y2)),
    possible_capture(Side, fig(king, X1, Y1), fig(_, X2, Y2), fig(king, X3, Y3)),
    way_for_capture_is_free(CapturingList, CapturedList, fig(king, X1, Y1), fig(_, X2, Y2), fig(king, X3, Y3)),
    list_absent(CapturedFiguresList, fig(_, X2, Y2)).

potential_intermediate_king_pos_with_capture(Side, CapturingList, CapturedList, CapturedFiguresList, pos(X1, Y1), pos(X2, Y2), pos(X3, Y3)) :-
    potential_intermediate_king_pos(Side, CapturingList, CapturedList, CapturedFiguresList, pos(X1, Y1), pos(X2, Y2), pos(X3, Y3)),
    list_delete_one(CapturingList, fig(king, X1, Y1), TmpCapturingList),
    list_append(TmpCapturingList, [fig(king, X3, Y3)], NewCapturingList),
    list_append(CapturedFiguresList, [fig(man, X2, Y2)], NewCapturedFiguresList),
    potential_intermediate_king_pos(Side, NewCapturingList, CapturedList, NewCapturedFiguresList, pos(X3, Y3), _, _).

potential_intermediate_king_pos_list(Side, CapturingList, CapturedList, CapturedFiguresList, pos(X1, Y1), pos(X2, Y2), List) :-
    findall(Position, potential_intermediate_king_pos_with_capture(Side, CapturingList, CapturedList, CapturedFiguresList, pos(X1, Y1), pos(X2, Y2), Position), List).

allowable_intermediate_capture_pos(_, _, _, _, fig(man, _, _), _, _) :- !.

allowable_intermediate_capture_pos(Side, CapturingList, CapturedList, CapturedFiguresList, fig(king, X1, Y1), fig(_, X2, Y2), fig(king, X3, Y3)) :-
    potential_intermediate_king_pos_list(Side, CapturingList, CapturedList, CapturedFiguresList, pos(X1, Y1), pos(X2, Y2), IntermediatePositionsWithCapture),
    (
        (IntermediatePositionsWithCapture = [], true, !);
        (list_member(IntermediatePositionsWithCapture, pos(X3, Y3)), !)
    ).

capture_single_figure(Side, CapturingList, CapturedList, NewCapturingList, CapturedFiguresList, NewCapturedFiguresList, CapturingFigure, NewCapturingFigure) :-
    list_delete_one(CapturingList, CapturingFigure, TmpCapturingList),
    list_member(CapturedList, CapturedFigure),
    possible_capture(Side, CapturingFigure, CapturedFigure, NewCapturingFigure),
    way_for_capture_is_free(CapturingList, CapturedList, CapturingFigure, CapturedFigure, NewCapturingFigure),
    CapturedFigure = fig(_, X2, Y2),
    allowable_intermediate_capture_pos(Side, CapturingList, CapturedList, CapturedFiguresList, CapturingFigure, CapturedFigure, NewCapturingFigure),
    list_absent(CapturedFiguresList, fig(_, X2, Y2)),
    list_append(TmpCapturingList, [NewCapturingFigure], NewCapturingList),
    list_append(CapturedFiguresList, [CapturedFigure], NewCapturedFiguresList).

capture_figures(Side, CapturingList, CapturedList, NewCapturingList, CapturedFiguresList, NewCapturedFiguresList, CapturingFigure, NewCapturingFigure) :-
    capture_single_figure(Side, CapturingList, CapturedList, TmpCapturingList, CapturedFiguresList, TmpCapturedFiguresList, CapturingFigure, TmpCapturingFigure),
    capture_multiple_figures(Side, TmpCapturingList, CapturedList, NewCapturingList, TmpCapturedFiguresList, NewCapturedFiguresList, TmpCapturingFigure, NewCapturingFigure).

capture_multiple_figures(Side, CapturingList, CapturedList, NewCapturingList, CapturedFiguresList, NewCapturedFiguresList, CapturingFigure, NewCapturingFigure) :-
    capture_single_figure(Side, CapturingList, CapturedList, _, CapturedFiguresList, _, CapturingFigure, _), !,
    capture_figures(Side, CapturingList, CapturedList, NewCapturingList, CapturedFiguresList, NewCapturedFiguresList, CapturingFigure, NewCapturingFigure).
capture_multiple_figures(_, CapturingList, _, CapturingList, CapturedList, CapturedList, CapturingFigure, CapturingFigure).

capture(black, board(Black, White), board(NewBlack, NewWhite)) :-
    capture_figures(black, Black, White, NewBlack, [], CapturedList, _, _),
    list_subtract(White, CapturedList, NewWhite).

capture(white, board(Black, White), board(NewBlack, NewWhite)) :-
    capture_figures(white, White, Black, NewWhite, [], CapturedList, _, _),
    list_subtract(Black, CapturedList, NewBlack).

move_capture(Side, Board1, Board2) :- capture(Side, Board1, Board2).
move(Side, Board1, Board2) :- capture(Side, Board1, _), !, move_capture(Side, Board1, Board2).

move(Side, board(Black, White), board(NewBlack, NewWhite)) :-
    move_figure(Side, board(Black, White), board(NewBlack, NewWhite)).

swap_node_type(min, max).
swap_node_type(max, min).

best_score_and_board(max, Board1, Score1, Board2, Score2, BestBoard, BestScore) :-
    (Score1 >= Score2, !, BestBoard = Board1, BestScore = Score1) ;
    (Score1  < Score2, BestBoard = Board2, BestScore = Score2).
best_score_and_board(min, Board1, Score1, Board2, Score2, BestBoard, BestScore) :-
    (Score1 =< Score2, !, BestBoard = Board1, BestScore = Score1) ;
    (Score1  > Score2, BestBoard = Board2, BestScore = Score2).

alpha_beta_prune(max, _, Beta, Value)  :- Value > Beta.
alpha_beta_prune(min, Alpha, _, Value) :- Value < Alpha.

update_alpha_beta(max, Alpha, Beta, Value, NewAlpha, Beta) :- (Value > Alpha, !, NewAlpha = Value) ; (NewAlpha = Alpha).
update_alpha_beta(min, Alpha, Beta, Value, Alpha, NewBeta) :- (Value < Beta,  !, NewBeta = Value) ; (NewBeta = Beta).

possible_moves_list(Side, Board, List) :- findall(NewBoard, move(Side, Board, NewBoard), List).

find_best_move(_, _, [BestBoard], BestBoard, BestScore, 0, _, _) :-
    evaluate_board(BestBoard, BestScore), !.

find_best_move(Side, NodeType, [Board1 | Tail], BestBoard, BestScore, 0, Alpha, Beta) :-
    evaluate_board(Board1, Score1),
    (
        (alpha_beta_prune(NodeType, Alpha, Beta, Score1), !, BestBoard = Board1, BestScore = Score1) ;
        (
            find_best_move(Side, NodeType, Tail, Board2, Score2, 0, Alpha, Beta),
            best_score_and_board(NodeType, Board1, Score1, Board2, Score2, BestBoard, BestScore)
        )
    ).

find_best_move(Side, NodeType, [BestBoard], BestBoard, BestScore, Depth, Alpha, Beta) :-
    Depth > 0,
    NewDepth is (Depth - 1),
    swap_node_type(NodeType, NextNodeType),
    other_side(Side, OtherSide),
    minmax(OtherSide, NextNodeType, BestBoard, _, BestScore, NewDepth, Alpha, Beta), !.

find_best_move(Side, NodeType, [Board1 | Tail], BestBoard, BestScore, Depth, Alpha, Beta) :-
    Depth > 0,
    NewDepth is (Depth - 1),
    swap_node_type(NodeType, NextNodeType),
    other_side(Side, OtherSide),
    minmax(OtherSide, NextNodeType, Board1, _, Score1, NewDepth, Alpha, Beta),
    (
        (alpha_beta_prune(NodeType, Alpha, Beta, Score1), !, BestBoard = Board1, BestScore = Score1) ;
        (
            update_alpha_beta(NodeType, Alpha, Beta, Score1, NewAlpha, NewBeta),
            find_best_move(Side, NodeType, Tail, Board2, Score2, Depth, NewAlpha, NewBeta),
            best_score_and_board(NodeType, Board1, Score1, Board2, Score2, BestBoard, BestScore)
        )
    ).

minmax(Side, _, Board, Board, Score, _, _, _) :-
    possible_moves_list(Side, Board, []),
    evaluate_board(Board, Score), !.

minmax(Side, NodeType, Board, BestBoard, BestScore, Depth, Alpha, Beta) :-
    possible_moves_list(Side, Board, PossibleMoves),
    find_best_move(Side, NodeType, PossibleMoves, BestBoard, BestScore, Depth, Alpha, Beta).

smart_move(white, Board, NewBoard) :-
    look_ahead_on(Depth), minmax(white, max, Board, NewBoard, _, Depth, -100000, 100000).
smart_move(black, Board, NewBoard) :-
    look_ahead_on(Depth), minmax(black, min, Board, NewBoard, _, Depth, -100000, 100000).

board_lists(black, board(Black, White), Black, White).
board_lists(white, board(Black, White), White, Black).

intermediate_diagonal_positions(pos(X, Y), pos(X, Y), []) :- !.
intermediate_diagonal_positions(pos(X1, Y1), pos(X2, Y2), [pos(X1, Y1) | Tail]) :-
    NextX is (X1 + sign(X2 - X1)), NextY is (Y1 + sign(Y2 - Y1)),
    pos(NextX, NextY),
    intermediate_diagonal_positions(pos(NextX, NextY), pos(X2, Y2), Tail).

intermediate_positions_from_path([], []) :- !.
intermediate_positions_from_path([pos(_, _)], []) :- !.
intermediate_positions_from_path([pos(X1, Y1), pos(X2, Y2) | T1], List) :-
    intermediate_diagonal_positions(pos(X1, Y1), pos(X2, Y2), [_ | Positions]),
    list_append(Positions, Rest, List),
    intermediate_positions_from_path([pos(X2, Y2) | T1], Rest).

subtract_figures_list(FiguresList, [], FiguresList) :- !.
subtract_figures_list(FiguresList, [pos(X, Y) | Tail], NewFiguresList) :-
    list_subtract(FiguresList, [fig(_, X, Y)], TmpFiguresList),
    subtract_figures_list(TmpFiguresList, Tail, NewFiguresList).

subtract_figures(board(Black, White), board(NewBlack, NewWhite), PositionsList) :-
    subtract_figures_list(Black, PositionsList, NewBlack),
    subtract_figures_list(White, PositionsList, NewWhite).

deduce_final_figure_type(_, Type, Type, []) :- !.
deduce_final_figure_type(_, king, king, _) :- !.
deduce_final_figure_type(white, man, king, [pos(_, 7) | _]) :- !.
deduce_final_figure_type(black, man, king, [pos(_, 0) | _]) :- !.
deduce_final_figure_type(Side, man, Type, [_ | Tail]) :-
    deduce_final_figure_type(Side, man, Type, Tail).

can_move(Side, Board) :- move(Side, Board, _), !.
can_move(Side, _) :- other_side(Side, _), !, fail.