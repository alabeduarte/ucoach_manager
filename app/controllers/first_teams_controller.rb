class FirstTeamsController < ApplicationController
  before_filter :authenticate_user!
  
  def new
    @matches = Calendar.with_tactics
  end
  
  def create
    selected_match = Calendar.find(params[:match_id])
    @first_team = FirstTeam.create_from(
                                        match: selected_match,
                                        data: params[:_json],
                                        owner: current_user)   
    if @first_team
      @first_team.apply_score
      flash[:notice] = t(:formation_sent)
      redirect_to first_team_path(@first_team)
    else
      render :new
    end
  end
  
  def show
    @first_team = FirstTeam.find(params[:id])
    @formation = @first_team.formation
    @players_positions = @formation.players_ordered_by_positions
    respond_to do |format|
      format.html
      format.json  { 
        render :json => @formation.as_json(:include => {
          :players_positions => {:include => :player}
        }) 
      }
    end
  end
  
  def index
    @first_teams = FirstTeam.all    
    respond_to do |format|
      format.html
      format.xml  { render :xml => @first_teams }
      format.json  { render :json => @first_teams }
    end
  end
  
  def destroy
    @first_team = FirstTeam.find(params[:id])    
    @first_team.destroy

    respond_to do |format|
      format.html { redirect_to(first_teams_url) }
      format.xml  { head :ok }
    end
  end
  
end