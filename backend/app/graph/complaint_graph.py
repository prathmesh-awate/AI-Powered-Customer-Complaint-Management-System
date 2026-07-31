from langgraph.graph import StateGraph, END
from app.graph.state import ComplaintState
from app.agents.intake_agent import intake_agent
from app.agents.risk_agent import risk_agent
from app.agents.routing_agent import routing_agent
from app.agents.investigation_agent import investigation_agent

def should_escalate(state: ComplaintState) -> str:
    severity = state.get("severity", "Low")
    if severity in ["Critical", "High"]:
        return "investigate"
    return "route"

def build_graph():
    graph = StateGraph(ComplaintState)

    graph.add_node("intake", intake_agent)
    graph.add_node("risk", risk_agent)
    graph.add_node("route", routing_agent)
    graph.add_node("investigate", investigation_agent)

    graph.set_entry_point("intake")
    graph.add_edge("intake", "risk")

    graph.add_conditional_edges(
        "risk",
        should_escalate,
        {
            "investigate": "investigate",
            "route": "route",
        }
    )

    graph.add_edge("investigate", "route")
    graph.add_edge("route", END)

    return graph.compile()

complaint_graph = build_graph()